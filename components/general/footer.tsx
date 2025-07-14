"use client";

import { Button } from "@/components/ui/button";

const LINKS = ["Home", "About Us", "Blog", "Service"];
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="px-8 pt-20 dark:bg-[#232E3F] dark:text-[#F0DBCD]">
      <div className="container mx-auto">
        <div className="mt-16 flex flex-wrap items-center justify-center gap-y-4 border-t border-gray-200 py-6 md:justify-between">
          <p className="text-center text-gray-700 dark:text-[#F0DBCD] font-normal text-sm max-w-md md:max-w-none">
            &copy; {CURRENT_YEAR} Made with{" "}
            <a
              href="https://nextjs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              Tailwind & NextJS
            </a>{" "}
          </p>
          <ul className="flex items-center gap-8">
            {LINKS.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-sm font-normal text-gray-700 dark:text-[#F0DBCD] hover:text-gray-900 transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
            <li>
              <Button size="sm" variant="default" color="gray">
                Subscribe
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
