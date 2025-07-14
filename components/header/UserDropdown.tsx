"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { ChevronDown, User, Settings, Info, LogOut } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, error } = useCurrentUser();

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => setIsOpen(false);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 text-red-500 text-sm">
        Error loading user data
      </div>
    );
  }

  return (
    <div className="relative text-[#232E3F] dark:text-[#F0DBCD]">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-expanded={isOpen}
        aria-label="User menu"
      >
        <div className="relative h-10 w-10 rounded-full overflow-hidden">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || "User avatar"}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500" />
            </div>
          )}
        </div>
        
        <span className="font-medium text-sm truncate max-w-[120px]">
          {user?.first_name} {user?.last_name}
        </span>
        
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user?.email || "No email"}
          </p>
        </div>

        <ul className="p-1">
          <DropdownItem
            onItemClick={closeDropdown}
            href="/profile"
            className="flex items-center gap-2 p-2 text-sm rounded dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <User className="h-4 w-4" />
            Edit profile
          </DropdownItem>
          
          <DropdownItem
            onItemClick={closeDropdown}
            href="/account-settings"
            className="flex items-center gap-2 p-2 text-sm rounded dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings className="h-4 w-4" />
            Account settings
          </DropdownItem>
          
          <DropdownItem
            onItemClick={closeDropdown}
            href="/support"
            className="flex items-center gap-2 p-2 text-sm rounded dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Info className="h-4 w-4" />
            Support
          </DropdownItem>
        </ul>

        <div className="p-1 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 p-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
        </div>
      </Dropdown>
    </div>
  );
}