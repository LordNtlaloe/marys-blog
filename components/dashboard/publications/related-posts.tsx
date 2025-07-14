"use client";

import { getPostsByCategoryName } from "@/actions/posts.actions";
import ProjectCard from "@/components/general/project-card";
import { useEffect, useState } from "react";

interface Story {
    _id: string;
    title: string;
    excerpt: string;
    featuredImageUrl?: string;
    slug: string;
    category?: {
        name: string;
    };
}

interface RelatedStoriesProps {
    currentStoryId: string;
    currentCategory?: string;
}

export default function RelatedStories({ currentStoryId, currentCategory }: RelatedStoriesProps) {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            if (!currentCategory) {
                setLoading(false);
                return;
            }

            try {
                const result = await getPostsByCategoryName(currentCategory);

                // Check if result has error property
                if (result && 'error' in result) {
                    console.error('Error fetching stories:', result.error);
                    setStories([]);
                } else {
                    // Filter out the current story and set the stories
                    const filteredStories = (result as Story[]).filter(story => story._id !== currentStoryId);
                    setStories(filteredStories);
                }
            } catch (error) {
                console.error('Error fetching related stories:', error);
                setStories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [currentCategory, currentStoryId]);

    if (loading) {
        return (
            <div className="text-amber-100 p-8 text-center">
                Loading related stories...
            </div>
        );
    }

    if (!stories.length) {
        return (
            <div className="text-amber-100 p-8 text-center">
                No related stories found.
            </div>
        );
    }

    return (
        <aside aria-label="Related stories" className="py-8 lg:py-16 bg-[#3A2E1F]">
            <div className="px-4 mx-auto max-w-screen-xl">
                <h2 className="mb-8 text-2xl font-bold text-amber-100">
                    More Stories You Might Enjoy
                </h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
            </div>
        </aside>
    );
}