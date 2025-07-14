import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface User {
        role?: "User" | "Admin"
    }

    interface Session {
        user: {
            id: string
            role: "User" | "Admin"
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: "User" | "Admin"
    }
}