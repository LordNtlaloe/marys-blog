import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    secure: true
});

// Define the Cloudinary upload result type
interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    // Add other properties as needed
}

export async function uploadImage(file: File): Promise<string | null> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'blog-posts' },
                (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    if (result) {
                        resolve(result as CloudinaryUploadResult);
                    } else {
                        reject(new Error('No result returned from Cloudinary'));
                    }
                }
            ).end(buffer);
        });

        return result.secure_url || null;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}