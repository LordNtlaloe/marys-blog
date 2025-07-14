"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

// Define the Post type to replace 'any'
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

export const postColumns: ColumnDef<Post>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "excerpt",
        header: "Excerpt",
        cell: ({ row }) => (
            <div className="text-muted-foreground truncate max-w-[200px]">
                {row.getValue("excerpt")}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    variant={
                        status === "published"
                            ? "default"
                            : status === "draft"
                                ? "secondary"
                                : "destructive"
                    }
                >
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "readTime",
        header: "Read Time",
        cell: ({ row }) => <span>{row.getValue("readTime")} min</span>,
    },
    {
        accessorKey: "views",
        header: "Views",
        cell: ({ row }) => <span>{row.getValue("views")}</span>,
    },
    {
        accessorKey: "likes",
        header: "Likes",
        cell: ({ row }) => <span>{row.getValue("likes")}</span>,
    },
    {
        accessorKey: "publishedAt",
        header: "Published",
        cell: ({ row }) => {
            const value = row.getValue("publishedAt") as string | Date | null
            if (!value) {
                return <span className="text-muted-foreground italic">Not published</span>
            }
            return <span>{formatDate(value)}</span>
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
            const value = row.getValue("createdAt") as string | Date | null
            if (!value) {
                return <span className="text-muted-foreground italic">No date</span>
            }
            return <span>{formatDate(value)}</span>
        },
    },
    {
        accessorKey: "author_name",
        header: "Author",
        cell: ({ row }) => <span>{row.getValue("author_name")}</span>,
    },
    {
        accessorKey: "category_name",
        header: "Category",
        cell: ({ row }) => (
            <Badge variant="outline">{row.getValue("category_name")}</Badge>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const post = row.original

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
                                // Implement delete logic here
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
