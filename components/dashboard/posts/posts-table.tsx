"use client"

import React, { useEffect, useState } from "react"
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    SortingState,
    ColumnFiltersState,
    flexRender,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { postColumns } from "@/components/dashboard/posts/posts-columns"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getAllPosts } from "@/actions/posts.actions"

// Reuse the Post interface defined in posts-columns.tsx or redefine here if needed
interface Post {
    _id: string
    title: string
    excerpt: string
    status: 'published' | 'draft' | 'archived'
    readTime: number
    views: number
    likes: number
    publishedAt: string | Date | null
    createdAt: string | Date | null
    author_name: string
    category_name: string
    slug: string
}


export default function PostsTable() {
    const [posts, setPosts] = useState<Post[]>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                const response = await getAllPosts()

                console.log("Posts response:", response)

                // Better null/undefined checking
                if (response && Array.isArray(response)) {
                    // Ensure all posts have proper structure and convert any ObjectId to string
                    const sanitizedPosts = response.map((post: Post) => ({
                        ...post,
                        _id: post._id?.toString() || post._id || '',
                        publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : null,
                        createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : null,
                    }))
                    setPosts(sanitizedPosts)
                } else if (response && typeof response === 'object' && 'error' in response) {
                    toast.error(response.error || "Failed to fetch posts")
                    setPosts([])
                } else {
                    toast.error("Invalid response format")
                    setPosts([])
                }
            } catch (error) {
                toast.error("Failed to fetch posts")
                console.error("Fetch error:", error)
                setPosts([])
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    const table = useReactTable({
        data: posts,
        columns: postColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4 flex-row justify-between">
                <Input
                    placeholder="Filter posts..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <div className="flex flex-row gap-x-3">
                        <Button onClick={() => router.push("/dashboard/posts/create")}>
                            Add New Post
                        </Button>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuItem
                                    key={column.id}
                                    onClick={() => column.toggleVisibility()}
                                >
                                    {column.id}
                                </DropdownMenuItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={postColumns.length} className="text-center">
                                    Loading posts...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={postColumns.length} className="text-center">
                                    No posts found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end gap-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                />
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                />
            </div>
        </div>
    )
}