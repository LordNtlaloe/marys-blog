// components/dashboard/categories/category-form.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createCategory, updateCategory } from "@/actions/categories.actions"
import { CategorySchema } from "@/schemas"

type CategoryFormValues = z.infer<typeof CategorySchema>

export interface CategoryFormProps {
    initialData?: {
        _id?: string
        name?: string
        slug?: string
        description?: string
    }
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(CategorySchema),
        defaultValues: initialData || {
            name: "",
            slug: "",
            description: "",
        }
    })

    const onSubmit = async (values: CategoryFormValues) => {
        try {
            setLoading(true)

            const result = initialData?._id
                ? await updateCategory(initialData._id, values)
                : await createCategory(values)

            if (result?.success) {
                toast.success(`Category ${initialData?._id ? 'updated' : 'created'} successfully`)
                router.push("/dashboard/categories")
            } else {
                toast.error(result?.error || `Failed to ${initialData?._id ? 'update' : 'create'} category`)
            }
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : "An unexpected error occurred"
            toast.error(errMsg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">
                {initialData?._id ? "Edit Category" : "Create New Category"}
            </h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Technology" {...field} disabled={loading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., technology" {...field} disabled={loading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Short description" {...field} disabled={loading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/categories")} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Processing..." : initialData?._id ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}