"use client";

import Link from "next/link";
import {
  Bell,
  CircleUserRound,
  House,
  Search,
  SquarePlus,
  UserRoundArrowLeft,
} from "lucide-react";
import { NavbarProps } from "./navbar";

export function MobileNav({
  isSignedIn,
  selectedNav,
  onNavChange,
}: NavbarProps) {
  // grid-flow-col auto-cols-fr
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 w-full px-0.5 border-t">
      <div className="grid grid-cols-5 justify-center items-center gap-2 overflow-y-scroll">
        <Link
          href="/"
          onClick={() => onNavChange("/")}
          className={`flex flex-col items-center p-2 rounded-md ${selectedNav === "/" ? "bg-secondary" : ""}`}
        >
          <House className="size-5.5" />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          href="/explore"
          onClick={() => onNavChange("/explore")}
          className={`flex flex-col items-center p-2 rounded-md ${selectedNav === "/explore" ? "bg-secondary" : ""}`}
        >
          <Search className="size-5.5" />
          <span className="text-xs">Search</span>
        </Link>
        <Link
          href="/create"
          onClick={() => onNavChange("/create")}
          className={`flex flex-col items-center p-2 rounded-md ${selectedNav === "/create" ? "bg-secondary" : ""}`}
        >
          <SquarePlus className="size-5.5" />
          <span className="text-xs">Create</span>
        </Link>
        <Link
          href="/notifications"
          onClick={() => onNavChange("/notifications")}
          className={`flex flex-col items-center p-1 rounded-md ${selectedNav === "/notifications" ? "bg-secondary" : ""}`}
        >
          <Bell className="size-5.5" />
          <span className="text-xs">Notifications</span>
        </Link>
        <Link
          href={isSignedIn ? "/profile" : "/sign-in"}
          onClick={() => onNavChange("/profile")}
          className={`flex flex-col items-center p-2 rounded-md ${selectedNav === "/profile" ? "bg-secondary" : ""}`}
        >
          {isSignedIn ? (
            <>
              <CircleUserRound className="size-5.5" />
              <span className="text-xs">Profile</span>
            </>
          ) : (
            <>
              <UserRoundArrowLeft className="size-5.5" />
              <span className="text-xs">Log in</span>
            </>
          )}
        </Link>
      </div>
    </nav>
  );
}
