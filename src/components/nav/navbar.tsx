"use client";

import { DesktopNav } from "./desktopNav";
import { MobileNav } from "./mobileNav";
import { authClient } from "@/lib/auth-client";

export interface NavbarProps {
  isSignedIn: boolean;
}

interface Props {}

export function Navbar({}: Props) {
  const { data: session } = authClient.useSession();

  return (
    <div>
      <DesktopNav isSignedIn={!!session} />
      <MobileNav isSignedIn={!!session} />
    </div>
  );
}
