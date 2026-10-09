"use client";

import { useState } from "react";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { authClient } from "@/lib/auth-client";

export type NavbarLinks =
  | "/"
  | "/explore"
  | "/create"
  | "/notifications"
  | "/profile";

export interface NavbarProps {
  isSignedIn: boolean;
  profileLink: string;
  selectedNav: NavbarLinks;
  goToOwnProfile: () => void;
  onNavChange: (link: NavbarLinks) => void;
}

export function Navbar() {
  const { data: session } = authClient.useSession();
  const [selectedNav, setSelectedNav] = useState<NavbarLinks>("/");
  const profileLink = `/profile/${session?.user.username}` || "";

  const handleNav = (link: NavbarLinks) => {
    setSelectedNav(link);
  };

  const handleProfileClick = () => {};

  return (
    <div>
      <DesktopNav
        profileLink={profileLink}
        isSignedIn={!!session}
        selectedNav={selectedNav}
        onNavChange={handleNav}
        goToOwnProfile={handleProfileClick}
      />
      <MobileNav
        profileLink={profileLink}
        isSignedIn={!!session}
        selectedNav={selectedNav}
        onNavChange={handleNav}
        goToOwnProfile={handleProfileClick}
      />
    </div>
  );
}
