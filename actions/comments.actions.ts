"use server"

import { connectToDB } from "@/lib/db";
import { ObjectId } from "mongodb";

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

export const createComment = async (commentData: {
    postId: string;
    authorId: string;
    content: string;
    parentCommentId?: string;
}) => {
    if (!dbConnection) await init();
    try {
        const collection = await database?.collection("comments");

        if (!database || !collection) {
            console.log("Failed to connect to comments collection...");
            return { error: "Failed to connect to comments collection" };
        }

        const newComment = {
            ...commentData,
            postId: new ObjectId(commentData.postId),
            authorId: new ObjectId(commentData.authorId),
            parentCommentId: commentData.parentCommentId ? new ObjectId(commentData.parentCommentId) : null,
            createdAt: new Date(),
            updatedAt: new Date(),
            likes: 0,
            isApproved: true,
            replies: []
        };

        const result = await collection.insertOne(newComment);
        return { success: true, commentId: result.insertedId };
    } catch (error: any) {
        console.log("An error occurred...", error.message);
        return { error: error.message };
    }
}

export const getCommentsByPostId = async (postId: string) => {
    if (!dbConnection) await init();
    try {
        const collection = await database?.collection("comments");

        if (!database || !collection) {
            console.log("Failed to connect to comments collection...");
            return { error: "Failed to connect to comments collection" };
        }

        const comments = await collection.aggregate([
            {
                $match: {
                    postId: new ObjectId(postId),
                    parentCommentId: null,
                    isApproved: true
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "users",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: "$author" },
            {
                $lookup: {
                    from: "comments",
                    let: { commentId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$parentCommentId", "$$commentId"] } } },
                        { $sort: { createdAt: 1 } },
                        {
                            $lookup: {
                                from: "users",
                                localField: "authorId",
                                foreignField: "_id",
                                as: "author"
                            }
                        },
                        { $unwind: "$author" }
                    ],
                    as: "replies"
                }
            }
        ]).toArray();

        return comments;
    } catch (error: any) {
        console.log("An error occurred...", error.message);
        return { error: error.message };
    }
}
