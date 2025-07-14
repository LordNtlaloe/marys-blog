"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils"; // optional utility for conditional classes
import { ThemeToggleButton } from "../common/ThemeToggleButton";

const NAV_MENU = [
  { name: "Home", href: "/" },
  { name: "Publications", href: "/publications" },
  { name: "Blog", href: "/blog" },
  { name: "Resources", href: "/resources" },
];

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

function NavItem({ children, href, className }: NavItemProps) {
  return (
    <li>
      <Link
        href={href || "#"}
        className={cn(
          "flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-[#F0DBCD] hover:underline",
          className
        )}
      >
        {children}
      </Link>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#90B0C0] bg-white dark:bg-[#232E3F] text-[#232E3F]">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <h1 className="text-lg font-bold dark:text-[#F0DBCD]">Rorisang Moerane</h1>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-8 ml-10">
          {NAV_MENU.map(({ name, href }) => (
            <NavItem key={name} href={href}>
              {name}
            </NavItem>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-2">
          <Button variant="ghost">Sign In</Button>
          <Link href="#">
            <Button variant="default">Contact</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="ml-auto p-2 lg:hidden text-gray-700 dark:text-[#F0DBCD]"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-t border-gray-200 px-4 pb-4">
          <ul className="flex flex-col gap-4 pt-4">
            {NAV_MENU.map(({ name, href }) => (
              <NavItem key={name} href={href}>
                {name}
              </NavItem>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-2">
            <ThemeToggleButton />
            <Link href="#">
              <Button variant="default"><Link href="/auth/sign-in">Sign In</Link></Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
