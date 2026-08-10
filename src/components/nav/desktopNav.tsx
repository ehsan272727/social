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

export function DesktopNav({
  isSignedIn,
  selectedNav,
  onNavChange,
}: NavbarProps) {
  return (
    <nav className="h-lvh hidden sm:block w-full pl-3 pr-2 py-2 font-bold  border-r">
      <h1 className="hidden md:block mb-5 text-2xl lg:text-3xl">Social</h1>
      <div className="flex flex-col gap-4">
        <Link
          href="/"
          onClick={() => onNavChange("/")}
          className={`flex items-center gap-3 py-2.5 px-2.5 md:pr-16 rounded-md ${selectedNav === "/" ? "bg-secondary" : ""}`}
        >
          <House className="size-7" />
          <span className="hidden md:inline text-sm">Home</span>
        </Link>
        <Link
          href="/explore"
          onClick={() => onNavChange("/explore")}
          className={`flex items-center gap-3 py-2.5 px-2.5 md:pr-16 rounded-md ${selectedNav === "/explore" ? "bg-secondary" : ""}`}
        >
          <Search className="size-7" />
          <span className="hidden md:inline text-sm">Search</span>
        </Link>
        <Link
          href="/create"
          onClick={() => onNavChange("/create")}
          className={`flex items-center gap-3 py-2.5 px-2.5 md:pr-16 rounded-md ${selectedNav === "/create" ? "bg-secondary" : ""}`}
        >
          <SquarePlus className="size-7" />
          <span className="hidden md:inline text-sm">Create</span>
        </Link>
        <Link
          href="/notifications"
          onClick={() => onNavChange("/notifications")}
          className={`flex items-center gap-3 py-2.5 px-2.5 md:pr-16 rounded-md ${selectedNav === "/notifications" ? "bg-secondary" : ""}`}
        >
          <Bell className="size-7" />
          <span className="hidden md:inline text-sm">Notifications</span>
        </Link>
        <Link
          href={isSignedIn ? "/profile" : "/sign-in"}
          onClick={() => onNavChange("/profile")}
          className={`flex items-center gap-3 py-2.5 px-2.5 md:pr-16 rounded-md ${selectedNav === "/profile" ? "bg-secondary" : ""}`}
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
