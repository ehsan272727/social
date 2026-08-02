"use client";

import { useState } from "react";
import { DesktopNav } from "./desktopNav";
import { MobileNav } from "./mobileNav";
import { authClient } from "@/lib/auth-client";

export type NavbarLinks =
  | "/"
  | "/explore"
  | "/create"
  | "/notifications"
  | "/profile";

export interface NavbarProps {
  isSignedIn: boolean;
  selectedNav: NavbarLinks;
  onNavChange: (link: NavbarLinks) => void;
}

export function Navbar() {
  const { data: session } = authClient.useSession();
  const [selectedNav, setSelectedNav] = useState<NavbarLinks>("/");

  const handleNav = (link: NavbarLinks) => {
    setSelectedNav(link);
  };

  return (
    <div>
      <DesktopNav
        isSignedIn={!!session}
        selectedNav={selectedNav}
        onNavChange={handleNav}
      />
      <MobileNav
        isSignedIn={!!session}
        selectedNav={selectedNav}
        onNavChange={handleNav}
      />
    </div>
  );
}
