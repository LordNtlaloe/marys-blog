"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Remove unused import
// import { useRouter } from "next/navigation"

interface Publication {
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

export const postColumns: ColumnDef<Publication>[] = [
    // ... other column definitions
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const post = row.original
            // const router = useRouter()  <-- Remove this hook usage here

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link
                                href={`/posts/${post.slug}`}
                                className="flex items-center w-full"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                console.log("Delete post", post._id)
                                // Implement delete logic
                            }}
                            className="text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
