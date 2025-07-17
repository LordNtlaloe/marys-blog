/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, use } from "react";
import { getPostsBySlug } from "@/actions/posts.actions";
import { getAllPosts } from "@/actions/posts.actions";
import { getAllCategories } from "@/actions/categories.actions";
import { getAllUsers } from "@/actions/user.actions";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share,
  UserPlus
} from "lucide-react";

export default function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [post, setStory] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentStories, setRecentStories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [postCategory, setStoryCategory] = useState<any | null>(null);
  const [author, setAuthor] = useState<any | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetched = await getPostsBySlug(slug);
        const recent = await getAllPosts();
        const cats = await getAllCategories();
        const users = await getAllUsers();

        // Fix: Check if fetched exists and is not null before using 'in' operator
        if (fetched && typeof fetched === 'object' && !("error" in fetched)) {
          setStory(fetched);

          // Ensure cats is an array before using find
          if (Array.isArray(cats)) {
            const matchedCategory = cats.find((cat: any) => cat._id === fetched.categoryId);
            setStoryCategory(matchedCategory || null);
          }

          // Ensure users is an array before using find
          if (Array.isArray(users)) {
            const matchedAuthor = users.find((user: any) => user._id === fetched.authorId);
            setAuthor(matchedAuthor || null);
          }
        } else {
          console.error("Error fetching post:", fetched);
        }

        if (Array.isArray(recent)) {
          setRecentStories(recent.slice(0, 5));
        }

        if (Array.isArray(cats)) {
          setCategories(cats);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return <div className="text-gray-600 p-8 text-center">Loading post...</div>;
  }

  if (!post) {
    return <div className="text-red-500 p-8 text-center">Story not found.</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="max-w-full px-4 sm:px-6 lg:px-8 mx-auto dark:bg-[#232E3F]">
      <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
        <div className="lg:col-span-2">
          <div className="py-8 lg:pe-8">
            <div className="space-y-5 lg:space-y-8">
              <Link
                className="inline-flex items-center gap-x-1.5 text-sm text-gray-600 decoration-2 hover:underline focus:outline-hidden focus:underline dark:text-blue-500"
                href="/blog"
              >
                <ArrowLeft className="size-4" />
                Back to Blog
              </Link>

              <h2 className="text-3xl font-bold lg:text-5xl dark:text-white">
                {post.title}
              </h2>

              <div className="flex items-center gap-x-5">
                {postCategory?.name && (
                  <div className="inline-flex items-center gap-1.5 py-1 px-3 sm:py-2 sm:px-4 rounded-full text-xs sm:text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200">
                    {postCategory.name}
                  </div>
                )}
                <p className="text-xs sm:text-sm text-gray-800 dark:text-neutral-200">
                  {post.createdAt ? formatDate(post.createdAt) : "Date not available"}
                </p>
              </div>

              {post.excerpt && (
                <div className="text-lg text-gray-800 dark:text-neutral-200">
                  {post.excerpt}
                </div>
              )}

              {post.featuredImageUrl && (
                <div className="text-center">
                  <figure className="relative w-full h-96">
                    <Image
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                      src={post.featuredImageUrl}
                      alt={post.title}
                      fill
                    />
                  </figure>
                  <span className="mt-3 block text-sm text-center text-gray-500 dark:text-neutral-500">
                    {post.title}
                  </span>
                </div>
              )}

              <div
                className="prose prose-lg max-w-none text-gray-800 dark:text-neutral-200"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-5 lg:gap-y-0">
                <div>
                  {post.tags &&
                    post.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="m-0.5 inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200"
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                <div className="flex justify-end items-center gap-x-1.5">
                  <button className="flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200">
                    <Heart className="size-4" />
                    {post.likes || 0}
                  </button>

                  <div className="block h-3 border-e border-gray-300 mx-3 dark:border-neutral-600" />

                  <button className="flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200">
                    <MessageCircle className="size-4" />
                    {post.comments?.length || 0}
                  </button>

                  <div className="block h-3 border-e border-gray-300 mx-3 dark:border-neutral-600" />

                  <div className="relative">
                    <button className="flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200">
                      <Share className="size-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 bg-[#232E3F]">
          <div className="sticky top-0 py-8 lg:ps-8">
            <div className="group flex items-center gap-x-3 border-b border-gray-200 pb-8 mb-8 dark:border-neutral-700">
              <Link className="block shrink-0" href={author?.profileUrl || "#"}>
                <Image
                  className="size-10 rounded-full"
                  src={author?.image || "https://images.unsplash.com/photo-1669837401587-f9a4cfe3126e?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"}
                  alt="Author Avatar"
                  width={40}
                  height={40}
                />
              </Link>

              <Link className="group grow block" href={author?.profileUrl || "#"}>
                <h5 className="text-sm font-semibold text-gray-800 group-hover:text-gray-600 dark:text-neutral-200 dark:group-hover:text-neutral-400">
                  {author?.first_name || "Anonymous"} {author?.last_name}
                </h5>
                <p className="text-sm text-gray-500 dark:text-neutral-500">
                  {author?.bio || "Author"}
                </p>
              </Link>

              <div className="grow">
                <div className="flex justify-end">
                  <button className="py-1.5 px-2.5 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700">
                    <UserPlus className="size-4" />
                    Follow
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {recentStories.map((recentStory, index) => (
                <Link key={index} className="group flex items-center gap-x-6" href={`/posts/${recentStory.slug}`}>
                  <div className="grow">
                    <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 dark:text-neutral-200 dark:group-hover:text-blue-500">
                      {recentStory.title}
                    </span>
                  </div>

                  <div className="shrink-0 relative rounded-lg overflow-hidden size-20">
                    <Image
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                      src={recentStory?.featuredImageUrl || "https://images.unsplash.com/photo-1567016526105-22da7c13161a?auto=format&fit=crop&w=320&q=80"}
                      alt={recentStory.title}
                      fill
                    />
                  </div>
                </Link>
              ))}
            </div>

            <div className="space-y-6 mt-8">
              {categories.map((category, index) => (
                <div key={index} className="group flex items-center gap-x-6">
                  <div className="grow">
                    <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 dark:text-neutral-200 dark:group-hover:text-blue-500">
                      {category.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}