"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <header className="bg-white p-8 dark:bg-[#232E3F] dark:text-[#F0DBCD]">
      <div className="container mx-auto grid h-full gap-10 min-h-[60vh] w-full grid-cols-1 items-center lg:grid-cols-2">
        <div className="row-start-2 lg:row-auto">
          <h1 className="mb-4 text-3xl lg:text-5xl font-bold leading-tight text-[#232E3F] dark:text-[#F0DBCD]">
            Rorisang<br /> Moerane
          </h1>
          <p className="mb-4 text-gray-600 dark:text-gray-100 md:pr-16 xl:pr-28">
            Hey, I&apos;m Rori.<br></br>

            I know this took an ice age and a half to
            do but now I&apos;ve got something to work
            off of. I&apos;ve got ideas for the images and
            themes I wanna use and will be working
            on those and the content next. This is
            the general vibe but I wanna incorporate
            warm colors.
          </p>
          <div className="grid">
            <label className="mb-2 text-[#232E3F] font-medium text-sm dark:text-[#F0DBCD]">
              Your email
            </label>
            <div className="mb-2 flex w-full flex-col gap-4 md:w-10/12 md:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full"
              />
              <Button className="w-full px-4 md:w-[12rem]" variant="default">
                Make A Request
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-100">
            Read my{" "}
            <a href="#" className="font-medium underline hover:text-[#806D61]">
              Terms and Conditions
            </a>
          </p>
        </div>
        <Image
          width={1024}
          height={1024}
          alt="Mary"
          src="/images/IMG_7989.jpg"
          className="h-[36rem] w-full rounded-xl object-cover"
        />
      </div>
    </header>
  );
}
