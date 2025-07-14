"use client";

import { ProjectCard } from "@/components/general/project-card";
import { getAllPosts } from "@/actions/posts.actions";
import { useEffect, useState } from "react";

interface Story {
  _id: string;
  title: string;
  excerpt: string;
  featuredImageUrl?: string;
  slug: string;
}

export function StoryCollection() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const result = await getAllPosts();
        if ("error" in result) {
          setError(result.error);
        } else {
          setStories(result);
        }
      } catch {
        setError("Failed to fetch stories");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 dark:bg-[#232E3F]">
        <p className="text-lg text-amber-100 animate-pulse">
          Curating your reading experience...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 dark:bg-[#232E3F] text-red-300">
        <p className="text-lg">Chapter missing: {error}</p>
      </div>
    );
  }

  return (
    <section className="py-20 px-6 dark:bg-[#232E3F] text-[#232E3f]">
      <div className="container mx-auto mb-16 text-center">
        <h2 className="mb-4 text-3xl lg:text-4xl font-bold dark:text-amber-100">
          Literary Vault
        </h2>
        <p className="mx-auto w-full px-4 dark:text-amber-100/80 font-normal lg:w-6/12">
          Where every story is a carefully locked treasure, waiting to be discovered by curious readers.
        </p>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <ProjectCard
            key={story._id}
            title={story.title}
            desc={story.excerpt}
            img={story.featuredImageUrl}
            slug={story.slug}
            id={story._id}
          />
        ))}
      </div>
    </section>
  );
}

export default StoryCollection;
