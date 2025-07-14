import * as z from "zod";


export const LoginSchema = z.object({
    email: z.string().email({ message: "Email Is Required" }),
    password: z.string({ message: "Password Is Required" })
})

export const SignUpSchema = z.object({
    first_name: z.string({ message: "First Name Is Required" }),
    last_name: z.string({ message: "Last Name Is Required" }),
    phone_number: z.string({ message: "Phone Number Is Required" }),
    email: z.string().email({ message: "Email Is Required" }),
    password: z.string({ message: "Password Is Required" }),
    role: z.string()
})

export const PasswordResetSchema = z.object({
    email: z.string().email({ message: "Email Is Required" }),
})

export const NewPasswordSchema = z.object({
    password: z.string().min(6, { message: "Email Is Required" }),
})


// Category Schema
export const CategorySchema = z.object({
    name: z.string({ message: "Category name is required" }),
    slug: z.string({ message: "Slug is required" }),
    description: z.string().optional(),
});

// Blog Post Schema
export const PostSchema = z.object({
    title: z.string().min(3, "Title is required"),
    excerpt: z.string().min(3, "Excerpt is required"),
    content: z.string().min(3, "Content is required"),
    authorId: z.string().min(1, "Select an author"),
    categoryId: z.string().min(1, "Select a category"),
    tags: z.array(z.string()).optional(),
    status: z.enum(["draft", "published", "archived"]),
    slug: z.string().min(3, "Slug is required"),
    featuredImage: z.string().optional(),

})

export const TagSchema = z.object({
    name: z.string({ message: "Tag name is required" }).min(2).max(50),
    slug: z.string({ message: "Slug is required" }).min(2).max(50),
    description: z.string().optional(),
})

export const PublicationSchema = z.object({
    title: z.string().min(3, "Title is required"),
    excerpt: z.string().min(3, "Excerpt is required"),
    content: z.string().min(3, "Content is required"),
    authorId: z.string().min(1, "Select an author"),
    categoryId: z.string().min(1, "Select a category"),
    tags: z.array(z.string()).optional(),
    status: z.enum(["draft", "published", "archived"]),
    slug: z.string().min(3, "Slug is required"),
    featuredImage: z.string().optional(),

})