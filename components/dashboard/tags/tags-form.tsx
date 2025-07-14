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
import { createTag, updateTag } from "@/actions/tag.actions"
import { TagSchema } from "@/schemas"

type TagFormValues = z.infer<typeof TagSchema>

interface TagFormProps {
    initialData?: {
        _id?: string
        name?: string
        slug?: string
        description?: string
    }
}

export default function TagForm({ initialData }: TagFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<TagFormValues>({
        resolver: zodResolver(TagSchema),
        defaultValues: initialData || {
            name: "",
            slug: "",
            description: "",
        }
    })

    const onSubmit = async (values: TagFormValues) => {
        try {
            setLoading(true)

            let result
            if (initialData?._id) {
                result = await updateTag(initialData._id, values)
            } else {
                result = await createTag(values)
            }

            if (result?.success) {
                toast.success(`Tag ${initialData?._id ? 'updated' : 'created'} successfully`)
                router.push("/dashboard/tags")
            } else {
                toast.error(result?.error || `Failed to ${initialData?._id ? 'update' : 'create'} tag`)
            }
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : "An unexpected error occurred"
            toast.error(errMsg)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">
                {initialData?._id ? "Edit Tag" : "Create New Tag"}
            </h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., React"
                                            {...field}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Slug */}
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., react"
                                            {...field}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="A short description of the tag"
                                            {...field}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/dashboard/tags")}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : initialData?._id ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}