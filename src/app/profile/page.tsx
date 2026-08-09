"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { isAPIError } from "better-auth/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";

export default function Profile() {
  const { data: session, isPending, error } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [isPending]);

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
        toast.add({ type: "error", description: error.message });
      }
    }
  }

  if (isPending) {
    return (
      <div className="mt-5 flex justify-center items-center gap-2">
        Checking user
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!isPending && !session) {
    return (
      <div className="mt-5 flex items-center justify-center gap-2">
        Redirecting to sign in page
        <Spinner className="size-5" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <h2 className="font-bold">
        {session.user.displayUsername
          ? session.user.displayUsername
          : session.user.name}
      </h2>
      <Button onClick={handleSignOut} className="flex items-center">
        <span>Sign out</span>
        <LogOut />
      </Button>
    </div>
  );
}
