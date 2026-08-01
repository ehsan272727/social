"use client";

import Link from "next/link";
import { NavbarProps } from "./navbar";
import {
  Bell,
  CircleUserRound,
  House,
  Search,
  SquarePlus,
  UserRoundArrowLeft,
} from "lucide-react";
import { Button } from "@base-ui/react";

export function DesktopNav({ isSignedIn }: NavbarProps) {
  return (
    <nav className="h-lvh hidden sm:block w-full pl-3 pr-2 py-2 font-bold  border-r">
      <h1 className="hidden md:block mb-5 text-2xl lg:text-3xl">Social</h1>
      <div className="flex flex-col gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 py-2.5 px-2.5 md:pr-16 rounded-md bg-secondary"
        >
          <House className="size-7" />
          <span className="hidden md:inline text-sm">Home</span>
        </Link>
        <Button className="flex items-center gap-3 py-2.5 px-2.5 md:pr-16">
          <Search className="size-7" />
          <span className="hidden md:inline text-sm">Search</span>
        </Button>
        <Button className="flex items-center gap-3 py-2.5 px-2.5 md:pr-16">
          <SquarePlus className="size-7" />
          <span className="hidden md:inline text-sm">Create</span>
        </Button>
        <Link
          href="/"
          className="flex items-center gap-3 py-2.5 px-2.5 md:pr-16"
        >
          <Bell className="size-7" />
          <span className="hidden md:inline text-sm">Notifications</span>
        </Link>
        <Link
          href={isSignedIn ? "/profile" : "/sign-in"}
          className="flex items-center gap-3 py-2.5 px-2.5 md:pr-16"
        >
          {isSignedIn ? (
            <>
              <CircleUserRound className="size-7" />
              <span className="hidden md:inline text-sm">Profile</span>
            </>
          ) : (
            <>
              <UserRoundArrowLeft className="size-7" />
              <span className="hidden md:inline text-sm">Log in</span>
            </>
          )}
        </Link>
      </div>
    </nav>
  );
}
