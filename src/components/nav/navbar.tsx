"use client";

import { DesktopNav } from "./desktopNav";
import { MobileNav } from "./mobileNav";
import { authClient } from "@/lib/auth-client";

export interface NavbarProps {
  isSignedIn: boolean;
}

export function Navbar() {
  const { data: session } = authClient.useSession();

  return (
    <div>
      <DesktopNav isSignedIn={!!session} />
      <MobileNav isSignedIn={!!session} />
    </div>
  );
}
