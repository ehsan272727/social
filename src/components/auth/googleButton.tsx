"use client";

import { GoogleIcon } from "@/icons/google";
import { Button } from "@/components/ui/button";

interface Props {
  handleGoogleSignIn: () => void;
}

export function GoogleButton({ handleGoogleSignIn }: Props) {
  return (
    <Button
      onClick={handleGoogleSignIn}
      size="lg"
      variant="secondary"
      className="flex justify-center items-center gap-3 py-5.5 cursor-pointer"
    >
      <GoogleIcon className="size-6 md:size-8" />
      <span>Continue with Google</span>
    </Button>
  );
}
