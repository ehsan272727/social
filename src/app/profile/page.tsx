"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { isAPIError } from "better-auth/api";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session, isPending, error } = authClient.useSession();
  const router = useRouter();

  async function handleSignOut() {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    } catch (error) {
      if (isAPIError(error)) {
        return "Error happened";
      }
    }
  }

  return (
    <div>
      <h1>Profile Page</h1>

      {session && (
        <>
          <h2>Welcome {session?.user.name}</h2>
          <Button onClick={handleSignOut} className="flex items-center">
            <span>Sign out</span>
            <LogOut />
          </Button>
        </>
      )}
    </div>
  );
}
