import NextAuth, { DefaultSession, User } from "next-auth"
import "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client, { db } from "./lib/database"
import { LoginSchema } from "@/schemas"
import { getUserByEmail, getUserById } from "@/actions/user.actions"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"
import { ObjectId } from "mongodb"

declare module "next-auth" {
  interface User {
    role?: "User" | "Admin"
  }

  interface Session {
    user: {
      role: "User" | "Admin"
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    role?: "User" | "Admin"
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client, {
    databaseName: "marys-blog"
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      async authorize(credentials): Promise<User | null> {
        try {
          const validatedFields = LoginSchema.safeParse(credentials)

          if (validatedFields.success) {
            const { email, password } = validatedFields.data

            const user = await getUserByEmail(email)

            if (!user || !user.password) {
              return null
            }

            const passwordsMatch = await bcrypt.compare(password, user.password)

            if (passwordsMatch) {
              // Return user object that matches the User interface
              return {
                id: user._id?.toString() || user.id?.toString(),
                email: user.email,
                name: user.name,
                role: user.role || "User"
              } as User
            }
          }
          return null
        } catch (error) {
          console.error("Authorization error:", error)
          return null
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error"
  },
  events: {
    async linkAccount({ user }) {
      try {
        if (user.id) {
          const collection = db.collection("users")

          // Use proper MongoDB query format
          let query: any
          if (ObjectId.isValid(user.id)) {
            query = { _id: new ObjectId(user.id) }
          } else {
            query = { id: user.id }
          }

          await collection.updateOne(
            query,
            {
              $set: {
                emailVerified: new Date(),
                role: "User"
              }
            },
            { upsert: false }
          )
        }
      } catch (error) {
        console.error("Link account error:", error)
      }
    }
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Allow OAuth without email verification
        if (account?.provider !== "credentials") {
          if (user.email) {
            const existingUser = await getUserByEmail(user.email)

            if (existingUser && !existingUser.role) {
              const collection = db.collection("users")
              await collection.updateOne(
                { email: user.email },
                { $set: { role: "User" } }
              )
            }
          }
          return true
        }

        // For credentials, check if user exists and is verified
        if (!user.id) {
          return false
        }

        const existingUser = await getUserById(user.id)

        // Allow sign in if user exists (remove email verification requirement for now)
        return !!existingUser
      } catch (error) {
        console.error("SignIn callback error:", error)
        return false
      }
    },

    async jwt({ token, user, account }) {
      try {
        // Initial sign in
        if (user) {
          token.sub = user.id?.toString()

          if (account?.provider !== "credentials") {
            // OAuth user
            if (user.email) {
              const existingUser = await getUserByEmail(user.email)
              if (existingUser) {
                token.role = existingUser.role || "User"
                token.sub = existingUser._id?.toString() || existingUser.id?.toString()

                if (!existingUser.role) {
                  const collection = db.collection("users")
                  await collection.updateOne(
                    { email: user.email },
                    { $set: { role: "User" } }
                  )
                  token.role = "User"
                }
              }
            }
          } else {
            // Credentials user
            token.role = user.role || "User"
          }
          return token
        }

        // Subsequent requests - refresh user data
        if (token.sub) {
          const existingUser = await getUserById(token.sub)

          if (existingUser) {
            token.role = existingUser.role || "User"

            if (!existingUser.role) {
              const collection = db.collection("users")
              let query: any
              if (ObjectId.isValid(existingUser._id)) {
                query = { _id: new ObjectId(existingUser._id) }
              } else {
                query = { _id: existingUser._id }
              }

              await collection.updateOne(
                query,
                { $set: { role: "User" } }
              )
              token.role = "User"
            }
          }
        }

        return token
      } catch (error) {
        console.error("JWT callback error:", error)
        return token
      }
    },

    async session({ session, token }) {
      try {
        if (token.sub && session.user) {
          session.user.id = token.sub
        }

        if (token.role && session.user) {
          session.user.role = token.role
        }

        return session
      } catch (error) {
        console.error("Session callback error:", error)
        return session
      }
    }
  }
})