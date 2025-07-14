"use server"

import { connectToDB } from "@/lib/db"
import { ObjectId } from "mongodb"
import { CategorySchema } from "@/schemas"
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

export const createCategory = async (values: z.infer<typeof CategorySchema>) => {
    if (!dbConnection) await init()
    try {
        const collection = await database?.collection("categories")

        if (!database || !collection) {
            console.log("Failed to connect to categories collection...")
            return { error: "Failed to connect to categories collection" }
        }

        const newCategory = {
            ...values,
            createdAt: new Date(),
            updatedAt: new Date(),
            postCount: 0
        }

        const result = await collection.insertOne(newCategory)
        return { success: true, categoryId: result.insertedId }
    } catch (error: any) {
        console.log("An error occurred...", error.message)
        return { error: error.message }
    }
}

// actions/category.actions.ts
export const getAllCategories = async () => {
    if (!dbConnection) await init()
    try {
        const collection = await database?.collection("categories")
        if (!database || !collection) {
            return { error: "Failed to connect to categories collection" }
        }

        const categories = await collection.find({}).sort({ name: 1 }).toArray()

        // Convert MongoDB objects to plain objects
        return categories.map((category: { _id: { toString: () => any } }) => ({
            ...category,
            _id: category._id.toString() // Convert ObjectId to string
        }))
    } catch (error: any) {
        return { error: error.message || "Failed to fetch categories" }
    }
}

export const getCategoryById = async (id: string) => {
    if (!dbConnection) await init()
    try {
        const collection = await database?.collection("categories")

        if (!database || !collection) {
            console.log("Failed to connect to categories collection...")
            return { error: "Failed to connect to categories collection" }
        }

        const category = await collection.findOne({ _id: new ObjectId(id) })
        return category || null
    } catch (error: any) {
        console.log("An error occurred...", error.message)
        return { error: error.message }
    }
}

export const updateCategory = async (id: string, values: z.infer<typeof CategorySchema>) => {
    if (!dbConnection) await init()
    try {
        const collection = await database?.collection("categories")

        if (!database || !collection) {
            console.log("Failed to connect to categories collection...")
            return { error: "Failed to connect to categories collection" }
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...values, updatedAt: new Date() } }
        )

        if (result.modifiedCount === 0) {
            return { error: "No changes made or category not found" }
        }

        return { success: true }
    } catch (error: any) {
        console.log("An error occurred...", error.message)
        return { error: error.message }
    }
}

export const deleteCategory = async (id: string) => {
    if (!dbConnection) await init()
    try {
        const collection = await database?.collection("categories")

        if (!database || !collection) {
            console.log("Failed to connect to categories collection...")
            return { error: "Failed to connect to categories collection" }
        }

        const result = await collection.deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            return { error: "Category not found" }
        }

        return { success: true }
    } catch (error: any) {
        console.log("An error occurred...", error.message)
        return { error: error.message }
    }
}