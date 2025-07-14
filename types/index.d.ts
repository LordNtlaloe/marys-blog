export interface Publication {
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