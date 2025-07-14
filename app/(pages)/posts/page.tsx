"use client";

import { useEffect, useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { getAllPosts } from "@/actions/posts.actions";
import { getAllCategories } from "@/actions/categories.actions";

// Interfaces
interface Author {
  _id: string;
  name: string;
  image?: string;
}

interface Category {
  _id: string;
  name: string;
  postCount?: number;
}

interface Post {
  _id: string;
  title: string;
  excerpt?: string;
  content: string;
  featuredImageUrl?: string;
  slug: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  author?: Author;
  categoryId?: string; // <-- important!
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPosts = await getAllPosts();
      const fetchedCategories = await getAllCategories();
      setPosts(fetchedPosts);
      setCategories(fetchedCategories);
    };
    fetchData();
  }, []);

  const featuredPosts = posts.slice(0, 2);
  const regularPosts = posts.slice(2);

  const getCategoryName = (categoryId?: string) => {
    return categories.find((cat) => cat._id === categoryId)?.name || "Uncategorized";
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <main className="mt-10">
        {/* Featured Posts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredPosts.map((post, index) => (
            <Card
              key={post._id}
              className={`relative overflow-hidden rounded-lg ${index === 0 ? "md:col-span-2" : "md:col-span-1"} h-96`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <Image
                src={post.featuredImageUrl || "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=2100&q=80"}
                className="absolute inset-0 w-full h-full object-cover z-0"
                alt={post.title}
              />
              <CardHeader className="relative z-20">
                <Badge variant="secondary" className="mb-2 w-fit">
                  {getCategoryName(post.categoryId)}
                </Badge>
                <CardTitle className="text-white text-2xl md:text-3xl">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardFooter className="relative z-20 flex items-center gap-3 mt-auto">
                <Avatar>
                  <AvatarImage src={post.author?.image} />
                  <AvatarFallback>{post.author?.name?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">{post.author?.name || "Unknown Author"}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Regular Posts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-10 mb-10">
          <div className="lg:col-span-3 space-y-6">
            {regularPosts.map((post) => (
              <Card key={post._id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-48 h-48 relative overflow-hidden rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none">
                    <Image
                      src={post.featuredImageUrl || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=2100&q=80"}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt={post.title}
                      width={500}
                      height={500}
                    />
                  </div>
                  <div className="flex-1">
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{post.excerpt || "No excerpt available"}</CardDescription>
                    </CardContent>
                    <CardFooter className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={post.author?.image} />
                        <AvatarFallback>{post.author?.name?.charAt(0) || "A"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{post.author?.name || "Unknown Author"}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  {categories.map((category) => (
                    <div key={category._id} className="px-0 py-4 border-b last:border-b-0">
                      <a href={`/categories/${category._id}`} className="flex items-center w-full">
                        <span
                          className="inline-block h-4 w-4 mr-3 rounded-full"
                          style={{
                            backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                          }}
                        />
                        <span className="flex-1">{category.name}</span>
                        <span className="text-muted-foreground text-sm">{category.postCount || 0}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Separator />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg uppercase">Subscribe</CardTitle>
                <CardDescription>
                  Get the best health articles delivered to your inbox
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action="/subscribe" method="POST" className="space-y-4">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your email address"
                    required
                  />
                  <Button type="submit" className="w-full">
                    Subscribe
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Separator />
          </div>
        </div>
      </main>
    </div>
  );
}
