"use client";

import { GoogleIcon } from "@/icons/google";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export function GoogleButton() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  async function handleGoogleSignIn() {
    try {
      setRedirecting(true);
      const { error } = await authClient.signIn.social({
        provider: "google",
      });
      if (error) {
        setRedirecting(false);
        toast.add({ type: "error", description: error.message });
        return;
      }
      setRedirecting(false);
      router.push("/");
    } catch (error) {
      setRedirecting(false);
      toast.add({ type: "error", description: "an unknown error" });
    }
  }

  return (
    <Button
      onClick={handleGoogleSignIn}
      size="lg"
      variant="secondary"
      disabled={redirecting}
      className="flex justify-center items-center gap-3 py-5.5 cursor-pointer"
    >
      <GoogleIcon className="size-5 md:size-6" />
      {redirecting ? "Redirecting..." : "Continue with Google"}
      {redirecting && <Spinner className="size-4.5" />}
    </Button>
  );
}
