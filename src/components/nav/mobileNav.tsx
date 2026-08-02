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
import { Button } from "@base-ui/react";
import { NavbarProps } from "./navbar";

export function MobileNav({ isSignedIn }: NavbarProps) {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 w-full px-3 py-2 border-t">
      <div className="flex items-center justify-evenly gap-5">
        <Link href="/" className="flex flex-col items-center">
          <House />
          <span className="text-sm">Home</span>
        </Link>
        <Link href="/explore" className="flex flex-col items-center">
          <Search />
          <span className="text-sm">Search</span>
        </Link>
        <Button className="flex flex-col items-center">
          <SquarePlus />
          <span className="text-sm">Create</span>
        </Button>
        <Link href="/" className="flex flex-col items-center">
          <Bell />
          <span className="text-sm">Notifications</span>
        </Link>
        <Link
          href={isSignedIn ? "/profile" : "/sign-in"}
          className="flex flex-col items-center"
        >
          {isSignedIn ? (
            <>
              <CircleUserRound />
              <span className="text-sm">Profile</span>
            </>
          ) : (
            <>
              <UserRoundArrowLeft />
              <span className="text-sm">Log in</span>
            </>
          )}
        </Link>
      </div>
    </nav>
  );
}
