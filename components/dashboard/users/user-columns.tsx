"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { deleteUser } from "@/actions/user.actions"

export interface User {
    _id: string
    firstName?: string
    lastName?: string
    email?: string
    role?: "admin" | "manager" | "user" | string
    createdAt?: string | Date
}

export const columns: ColumnDef<User>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: boolean | "indeterminate") => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "_id",
        header: "User ID",
        cell: ({ row }) => <div className="truncate max-w-[100px]">{row.getValue("_id")}</div>,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="font-medium">{`${row.original.firstName || ''} ${row.original.lastName || ''}`}</div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <div>{row.original.email || ''}</div>,
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.original.role || 'user'
            let variant: "default" | "secondary" | "destructive" | "outline" = "outline"

            if (role === "admin") variant = "destructive"
            if (role === "manager") variant = "secondary"
            if (role === "user") variant = "default"

            return (
                <Badge variant={variant}>
                    {String(role).charAt(0).toUpperCase() + String(role).slice(1)}
                </Badge>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const date = row.original.createdAt ? new Date(row.original.createdAt) : null
            return <div>{date ? date.toLocaleDateString() : 'N/A'}</div>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => <UserActionsCell user={row.original} />,
    },
]

interface UserActionsCellProps {
    user: User
}

function UserActionsCell({ user }: UserActionsCellProps) {
    const router = useRouter()

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
                <DropdownMenuItem onClick={() => router.push(`/users/${user._id}`)}>
                    View/Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={async () => {
                        await navigator.clipboard.writeText(user._id)
                        alert("User ID copied to clipboard")
                    }}
                >
                    Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={async () => {
                        if (confirm("Are you sure you want to delete this user?")) {
                            const result = await deleteUser(user._id)
                            if ("success" in result && result.success) {
                                router.refresh()
                                alert("User deleted successfully")
                            } else {
                                alert(result.error || "Failed to delete user")
                            }
                        }
                    }}
                >
                    Delete User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
