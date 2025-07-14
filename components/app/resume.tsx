"use client";

import { Button } from "@/components/ui/button";
import {
  ChartBarIcon,
  PuzzleIcon,
  TextCursor,
  ArrowRightIcon,
} from "lucide-react";
import { ResumeItem } from "@/components/general/resume-item";

const RESUME_ITEMS = [
  {
    icon: ChartBarIcon,
    children: "Bachelor of Science in Computer Science",
  },
  {
    icon: PuzzleIcon,
    children: "Certified Web Developer ",
  },
  {
    icon: TextCursor,
    children: "Frontend Framework Proficiency Certification",
  },
];

export function Resume() {
  return (
    <section className="px-8 py-24 dark:bg-[#29384e]">
      <div className="container mx-auto grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="col-span-1">
          <h2 className="text-3xl lg:text-4xl font-bold text-blue-900">
            My Resume
          </h2>
          <p className="mb-4 mt-3 w-9/12 text-gray-500 font-normal">
            Highly skilled and creative Web Developer with 5+ years of
            experience in crafting visually stunning and functionally robust
            websites and web applications.
          </p>
          <Button variant="ghost" className="flex items-center gap-2 px-0">
            View more
            <ArrowRightIcon className="h-4 w-4 text-gray-900" strokeWidth={3} />
          </Button>
        </div>
        <div className="col-span-1 grid gap-y-6 lg:ml-auto pr-0 lg:pr-12 xl:pr-32">
          {RESUME_ITEMS.map((props, idx) => (
            <ResumeItem key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Resume;
