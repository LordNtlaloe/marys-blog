"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

interface ProjectCardProps {
  id: string; // Added story ID
  slug: string; // Added story slug
  img?: string;
  title: string;
  desc: string;
}

export function ProjectCard({ slug, img, title, desc }: ProjectCardProps) {
  return (
    <Card className="shadow-none hover:bg-slate-50  dark:bg-[#29384e] px-4 dark:hover:bg-[#32445e] text-[#232E3F] dark:text-[#F0DBCD]">
      <CardHeader className="p-0 h-48 overflow-hidden rounded-md">
        <Link href={`/posts/${slug}`} className="block h-full">
          {img ? (
            <Image
              src={img}
              alt={title}
              width={768}
              height={400} // Changed to more appropriate aspect ratio
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="h-full w-full dark:bg-[#3a4d6b] flex items-center justify-center">
              <span className="text-gray-300 italic">Story Cover</span>
            </div>
          )}
        </Link>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <Link
          href={`/posts/${slug}`}
          className="block mb-2 text-lg font-semibold dark:text-gray-100 transition-colors hover:text-white"
        >
          {title}
        </Link>
        <div
          className="mb-4 dark:text-gray-300 line-clamp-3 text-sm"
          dangerouslySetInnerHTML={{ __html: desc }}
        />
      </CardContent>
      <CardFooter className="p-0 pb-4">
        <Link
          href={`/posts/${slug}`}
          className="dark:text-amber-300 dark:hover:text-amber-200 font-medium flex items-center text-slate-500"
        >
          Read Story
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1 w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default ProjectCard;