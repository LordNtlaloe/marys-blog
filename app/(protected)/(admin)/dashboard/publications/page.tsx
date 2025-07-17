"use client"

import PublicationsTable from "@/components/dashboard/publications/publications-table"

export default function PublicationsPage() {

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Blog Publications</h1>
            </div>
            <PublicationsTable />
        </div>
    )
}
