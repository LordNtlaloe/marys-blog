"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { EditorToolbar } from "@/components/dashboard/posts/editor-toolbar"
import { PostSchema } from "@/schemas"
import Underline from "@tiptap/extension-underline"
import { useSession } from "next-auth/react"
import { getAllCategories } from "@/actions/categories.actions"
import { getAllTags } from "@/actions/tag.actions"
import { createPost } from "@/actions/posts.actions"
import Image from "next/image"

type PostFormValues = z.infer<typeof PostSchema>

export default function CreatePostPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([])
    const [tagsList, setTagsList] = useState<string[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const form = useForm<PostFormValues>({
        resolver: zodResolver(PostSchema),
        defaultValues: {
            title: "",
            excerpt: "",
            content: "",
            authorId: session?.user?.id || "",
            categoryId: "",
            tags: [],
            status: "draft",
            slug: "",
        },
    })

    // Set the authorId to current user and disable the field
    useEffect(() => {
        if (session?.user?.id) {
            form.setValue("authorId", session.user.id)
        }
    }, [session, form])

    const excerptEditor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: "Write a short excerpt..."
            })
        ],
        content: "",
        onUpdate: ({ editor }) => {
            form.setValue("excerpt", editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[80px] p-3',
            },
        },
    })

    const contentEditor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({ placeholder: "Write the post content..." }),
            Underline
        ],
        content: "",
        onUpdate: ({ editor }) => {
            form.setValue("content", editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose max-w-none focus:outline-none min-h-[250px] p-3',
            },
        },
    })

    // In your useEffect where you load data
    useEffect(() => {
        async function loadData() {
            try {
                // Fetch categories
                const categoriesResponse = await getAllCategories()
                if (Array.isArray(categoriesResponse)) {
                    setCategories(categoriesResponse)
                } else {
                    toast.error("Failed to load categories")
                }

                // Fetch tags - ensure we get an array of strings
                const tagsResponse = await getAllTags()
                if (Array.isArray(tagsResponse)) {
                    // If tags are objects, extract names
                    const tagNames = tagsResponse.map(tag =>
                        typeof tag === 'string' ? tag : tag.name || tag._id.toString()
                    )
                    setTagsList(tagNames)
                } else {
                    toast.error("Failed to load tags")
                }
            } catch (error) {
                toast.error("Failed to load required data")
                console.error(error)
            }
        }
        loadData()
    }, [])

    const handleFileChange = (file: File | null) => {
        setFile(file)
    }

    const onSubmit = async (values: PostFormValues) => {
        setIsUploading(true)

        try {
            // Ensure current user is set as author
            if (!session?.user?.id) {
                toast.error("User not authenticated")
                return
            }

            // Prepare post data with current user as author
            const postData = {
                ...values,
                authorId: session.user.id, // Force current user as author
                tags: selectedTags
            }

            const result = await createPost(postData, file)

            if (result?.success) {
                toast.success("Post created successfully")
                router.push(`/posts/${values.slug}`)
            } else {
                toast.error(result?.error || "Failed to create post")
            }
        } catch (error) {
            console.error(error)
            toast.error("Unexpected error")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold">Create Blog Post</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Title */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Post title" {...field} />
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
                                    <Input placeholder="post-slug" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Current User Display (instead of author dropdown) */}
                    <FormItem hidden>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                                {session?.user?.image && (
                                    <Image
                                        src={session.user.image}
                                        alt="User"
                                        className="w-8 h-8 rounded-full"
                                        width={32}
                                        height={32}
                                    />
                                )}
                                <span className="text-sm font-medium">
                                    {session?.user?.name || "Current User"}
                                </span>
                                <Badge variant="secondary" className="ml-auto">
                                    You
                                </Badge>
                            </div>
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                            Posts are automatically assigned to your account
                        </p>
                    </FormItem>

                    {/* Category */}
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full text-left">
                                                {categories.find((c) => c._id === field.value)?.name || "Select category"}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {categories.map((cat) => (
                                                <DropdownMenuItem
                                                    key={cat._id}
                                                    onClick={() => field.onChange(cat._id)}
                                                >
                                                    {cat.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tags multi-select */}
                    <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                            <div className="flex flex-wrap gap-2">
                                {tagsList.map((tag) => {
                                    const isSelected = selectedTags.includes(tag)
                                    return (
                                        <Badge
                                            key={tag}
                                            variant={isSelected ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                if (isSelected) {
                                                    setSelectedTags(selectedTags.filter((t) => t !== tag))
                                                } else {
                                                    setSelectedTags([...selectedTags, tag])
                                                }
                                            }}
                                        >
                                            {tag}
                                        </Badge>
                                    )
                                })}
                            </div>
                        </FormControl>
                    </FormItem>

                    {/* Status */}
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full text-left">
                                                {field.value}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {["draft", "published", "archived"].map((status) => (
                                                <DropdownMenuItem key={status} onClick={() => field.onChange(status)}>
                                                    {status}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Excerpt - Rich Text Editor */}
                    <FormField
                        control={form.control}
                        name="excerpt"
                        render={() => (
                            <FormItem>
                                <FormLabel>Excerpt</FormLabel>
                                <FormControl>
                                    <div className="border rounded-md overflow-hidden">
                                        <EditorToolbar editor={excerptEditor} />
                                        <EditorContent editor={excerptEditor} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Content - Rich Text Editor */}
                    <FormField
                        control={form.control}
                        name="content"
                        render={() => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <div className="border rounded-md overflow-hidden">
                                        <EditorToolbar editor={contentEditor} />
                                        <EditorContent editor={contentEditor} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Featured Image Upload */}
                    <FormItem>
                        <FormLabel>Featured Image (Optional)</FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                    className="w-full"
                                />
                                {file && (
                                    <span className="text-sm text-gray-600">
                                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                )}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>

                    {/* Submit buttons */}
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isUploading}>
                            {isUploading ? "Creating..." : "Create Post"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}