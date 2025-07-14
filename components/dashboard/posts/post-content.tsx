"use client";

import Image from "next/image";
import Link from "next/link";
import RelatedStories from "@/components/dashboard/posts/related-posts";

interface StoryContentProps {
  story: {
    _id: string;
    title: string;
    content: string;
    excerpt: string;
    featuredImageUrl?: string;
    author?: {
      _id?: string;
      name: string;
      image?: string;
    };
    createdAt: string;
    category?: {
      _id?: string;
      name: string;
    };
  };
}

export default function StoryContent({ story }: StoryContentProps) {
  if (!story) return <div className="text-red-500 p-8">Story not found</div>;

  return (
    <>
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-[#2A2118] antialiased">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl">
          <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg dark:format-invert">
            <header className="mb-4 lg:mb-6 not-format">
              {story.author && (
                <address className="flex items-center mb-6 not-italic">
                  <div className="inline-flex items-center mr-3 text-sm text-amber-100">
                    <Image
                      className="mr-4 w-16 h-16 rounded-full"
                      src={story.author.image || "/default-avatar.jpg"}
                      alt={story.author.name}
                      width={64}
                      height={64}
                    />
                    <div>
                      <Link
                        href={`/authors/${story.author._id || story.author.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-xl font-bold text-amber-100 hover:text-amber-200"
                      >
                        {story.author.name}
                      </Link>
                      {story.category && (
                        <Link
                          href={`/categories/${story.category._id || story.category.name.toLowerCase()}`}
                          className="text-base text-amber-100/80 hover:text-amber-200"
                        >
                          {story.category.name}
                        </Link>
                      )}
                      <time
                        className="text-base text-amber-100/60"
                        dateTime={story.createdAt}
                      >
                        {new Date(story.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>
                </address>
              )}

              <h1 className="mb-4 text-3xl font-extrabold leading-tight text-amber-100 lg:mb-6 lg:text-4xl">
                {story.title}
              </h1>

              {story.featuredImageUrl && (
                <figure className="my-8">
                  <Image
                    src={story.featuredImageUrl}
                    alt={story.title}
                    width={1200}
                    height={630}
                    className="w-full rounded-lg"
                  />
                  <figcaption className="text-center mt-2 text-amber-100/60">
                    Featured image for {story.title}
                  </figcaption>
                </figure>
              )}
            </header>

            <div
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-amber-100 prose-p:text-amber-100/80 prose-a:text-amber-200 hover:prose-a:text-amber-300 prose-blockquote:text-amber-100/60"
              dangerouslySetInnerHTML={{ __html: story.content }}
            />
          </article>
        </div>
      </main>

      <RelatedStories
        currentStoryId={story._id}
        currentCategory={story.category?.name}
      />
    </>
  );
}