"use client"

import PostsTable from "@/components/dashboard/posts/posts-table"

export default function PostsPage() {

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Blog Posts</h1>
            </div>
            <PostsTable />
        </div>
    )
}
