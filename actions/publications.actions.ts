"use server";

import { connectToDB } from "@/lib/db";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from 'cloudinary';
import { z } from 'zod';
import { PublicationSchema } from '@/schemas';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    secure: true
});

let dbConnection: any;
let database: any;

const init = async () => {
    try {
        const connection = await connectToDB();
        dbConnection = connection;
        database = await dbConnection?.db("marys-blog");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
}

async function uploadToCloudinary(file: File): Promise<string | null> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'blog-publications',
                    resource_type: 'auto',
                    allowed_formats: ['jpg', 'png', 'webp', 'gif']
                },
                (error, result) => {
                    if (error || !result) {
                        console.error('Cloudinary upload error:', error);
                        reject(error || new Error('Upload failed'));
                        return;
                    }
                    resolve(result.secure_url);
                }
            );

            uploadStream.end(buffer);
        });
    } catch (error) {
        console.error('Error processing file upload:', error);
        return null;
    }
}

export const createPublication = async (data: z.infer<typeof PublicationSchema>, file?: File | null) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("publications");
        if (!database || !collection) {
            return { error: "Failed to connect to publications collection" };
        }

        let featuredImageUrl: string | undefined = undefined;

        if (file) {
            // Validate file
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
            if (file.size > MAX_FILE_SIZE) {
                return { error: "File size exceeds 5MB limit" };
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                return { error: "Only JPEG, PNG, WEBP, and GIF images are allowed" };
            }

            const uploadedUrl = await uploadToCloudinary(file);
            if (!uploadedUrl) {
                return { error: "Failed to upload featured image" };
            }
            featuredImageUrl = uploadedUrl;
        }

        const newPublication = {
            ...data,
            featuredImageUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
            views: 0,
            likes: 0,
            comments: []
        };

        const result = await collection.insertOne(newPublication);

        return {
            success: true,
            postId: result.insertedId,
            slug: data.slug
        };
    } catch (error: any) {
        console.error('Error creating post:', error);
        return {
            error: error.message || "Failed to create post",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
    }
};
export const getPublicationById = async (id: string) => {
    if (!dbConnection) await init();
    try {
        const collection = await database?.collection("publications");

        if (!database || !collection) {
            console.log("Failed to connect to publications collection...");
            return { error: "Failed to connect to publications collection" };
        }

        const post = await collection.aggregate([
            { $match: { _id: new ObjectId(id) } },
            {
                $lookup: {
                    from: "users",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$author" },
            { $unwind: "$category" }
        ]).toArray();

        return post[0] || null;
    } catch (error: any) {
        console.log("An error occurred...", error.message);
        return { error: error.message };
    }
}

export const getPublicationsById = async (id: string) => {
    if (!dbConnection) await init()
    try {
        const collection = await database?.collection("publications")

        if (!database || !collection) {
            console.log("Failed to connect to publications collection...")
            return { error: "Failed to connect to publications collection" }
        }

        const category = await collection.findOne({ _id: new ObjectId(id) })
        return category || null
    } catch (error: any) {
        console.log("An error occurred...", error.message)
        return { error: error.message }
    }
}


export const getPublicationsBySlug = async (slug: string) => {
    if (!dbConnection) await init();
    try {
        const collection = await database?.collection("publications");
        if (!database || !collection) {
            return { error: "Failed to connect to publications collection" };
        }

        const post = await collection.findOne({ slug });
        if (!post) return null;

        // Convert MongoDB objects to plain objects
        return {
            ...post,
            _id: post._id.toString(), // Convert ObjectId to string
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
            author: post.author ? {
                ...post.author,
                _id: post.author._id?.toString() // Handle nested ObjectId if exists
            } : null,
            category: post.category ? {
                ...post.category,
                _id: post.category._id?.toString() // Handle nested ObjectId if exists
            } : null
        };
    } catch (error: any) {
        console.error("Error fetching post:", error);
        return { error: error.message };
    }
};


export const getAllPublications = async () => {
    if (!dbConnection) await init()
    try {
        const collection = await database?.collection("publications")
        if (!database || !collection) {
            return { error: "Failed to connect to categories collection" }
        }

        const publications = await collection.find({}).sort({ name: 1 }).toArray()

        // Convert MongoDB objects to plain objects
        return publications.map((post: { _id: { toString: () => any } }) => ({
            ...post,
            _id: post._id.toString() // Convert ObjectId to string
        }))
    } catch (error: any) {
        return { error: error.message || "Failed to fetch categories" }
    }
}

export const updatePublication = async (id: string, updateData: any) => {
    if (!dbConnection) await init();
    try {
        const collection = await database?.collection("publications");

        if (!database || !collection) {
            console.log("Failed to connect to publications collection...");
            return { error: "Failed to connect to publications collection" };
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date(),
                    publishedAt: updateData.status === "published" ? new Date() : null
                }
            }
        );

        return result.modifiedCount > 0 ? { success: true } : { error: "Publication not found or no changes made" };
    } catch (error: any) {
        console.log("An error occurred...", error.message);
        return { error: error.message };
    }
}

export const deletePublication = async (id: string) => {
    if (!dbConnection) await init();
    try {
        const collection = await database?.collection("publications");

        if (!database || !collection) {
            console.log("Failed to connect to publications collection...");
            return { error: "Failed to connect to publications collection" };
        }

        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0 ? { success: true } : { error: "Publication not found" };
    } catch (error: any) {
        console.log("An error occurred...", error.message);
        return { error: error.message };
    }
}

export const incrementPublicationViews = async (id: string) => {
    if (!dbConnection) await init();
    try {
        const collection = await database?.collection("publications");

        if (!database || !collection) {
            console.log("Failed to connect to publications collection...");
            return { error: "Failed to connect to publications collection" };
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $inc: { views: 1 } }
        );

        return result.modifiedCount > 0 ? { success: true } : { error: "Publication not found" };
    } catch (error: any) {
        console.log("An error occurred...", error.message);
        return { error: error.message };
    }
}

export const searchPublications = async (
    query: string,
    page: number = 1,
    limit: number = 10
) => {
    if (!dbConnection) await init();
    try {
        const collection = await database?.collection("publications");

        if (!database || !collection) {
            console.log("Failed to connect to publications collection...");
            return { error: "Failed to connect to publications collection" };
        }

        const skip = (page - 1) * limit;

        const publications = await collection.aggregate([
            {
                $match: {
                    status: "published",
                    $or: [
                        { title: { $regex: query, $options: "i" } },
                        { content: { $regex: query, $options: "i" } },
                        { excerpt: { $regex: query, $options: "i" } },
                        { tags: { $in: [new RegExp(query, "i")] } }
                    ]
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$author" },
            { $unwind: "$category" }
        ]).toArray();

        const total = await collection.countDocuments({
            status: "published",
            $or: [
                { title: { $regex: query, $options: "i" } },
                { content: { $regex: query, $options: "i" } },
                { excerpt: { $regex: query, $options: "i" } },
                { tags: { $in: [new RegExp(query, "i")] } }
            ]
        });

        return {
            publications,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalPublications: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        };
    } catch (error: any) {
        console.log("An error occurred...", error.message);
        return { error: error.message };
    }
}