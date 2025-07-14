"use server"

import { connectToDB } from "@/lib/db"
import { ObjectId } from "mongodb"
import { TagSchema } from "@/schemas"
import { z } from "zod"

let dbConnection: any
let database: any

const init = async () => {
    try {
        const connection = await connectToDB()
        dbConnection = connection
        database = await dbConnection?.db("marys-blog")
    } catch (error) {
        console.error("Database connection failed:", error)
        throw error
    }
}

export const createTag = async (values: z.infer<typeof TagSchema>) => {
    if (!dbConnection) await init()
    try {
        const collection = await database?.collection("tags")

        if (!database || !collection) {
            return { error: "Failed to connect to tags collection" }
        }

        const newTag = {
            ...values,
            createdAt: new Date(),
            updatedAt: new Date(),
            postCount: 0
        }

        const result = await collection.insertOne(newTag)
        return { success: true, tagId: result.insertedId }
    } catch (error: any) {
        return { error: error.message || "Failed to create tag" }
    }
}

export const getAllTags = async () => {
    if (!dbConnection) await init()
    try {
        const collection = await database?.collection("tags")
        if (!database || !collection) {
            return { error: "Failed to connect to tags collection" }
        }

        const tags = await collection.find({}).sort({ name: 1 }).toArray()

        // Convert MongoDB objects to plain objects
        return tags.map((tag: { _id: { toString: () => any } }) => ({
            ...tag,
            _id: tag._id.toString() // Convert ObjectId to string
        }))
    } catch (error: any) {
        return { error: error.message || "Failed to fetch tags" }
    }
}
export const getTagById = async (id: string) => {
    if (!dbConnection) await init()
    try {
        const collection = await database?.collection("tags")

        if (!database || !collection) {
            return { error: "Failed to connect to tags collection" }
        }

        const tag = await collection.findOne({ _id: new ObjectId(id) })
        return tag || null
    } catch (error: any) {
        return { error: error.message || "Failed to fetch tag" }
    }
}

export const updateTag = async (id: string, values: z.infer<typeof TagSchema>) => {
    if (!dbConnection) await init()
    try {
        const collection = await database?.collection("tags")

        if (!database || !collection) {
            return { error: "Failed to connect to tags collection" }
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...values, updatedAt: new Date() } }
        )

        if (result.modifiedCount === 0) {
            return { error: "No changes made or tag not found" }
        }

        return { success: true }
    } catch (error: any) {
        return { error: error.message || "Failed to update tag" }
    }
}

export const deleteTag = async (id: string) => {
    if (!dbConnection) await init()
    try {
        const collection = await database?.collection("tags")

        if (!database || !collection) {
            return { error: "Failed to connect to tags collection" }
        }

        const result = await collection.deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            return { error: "Tag not found" }
        }

        return { success: true }
    } catch (error: any) {
        return { error: error.message || "Failed to delete tag" }
    }
}