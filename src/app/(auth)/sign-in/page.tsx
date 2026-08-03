"use client";

import { GoogleButton } from "@/components/auth/googleButton";
import { authClient } from "@/lib/auth-client";
import { isAPIError } from "better-auth/api";

export default function Page() {
  async function handleGoogleSignIn() {
    try {
      const data = await authClient.signIn.social({
        provider: "google",
      });
      console.log(data);
    } catch (error) {
      if (isAPIError(error)) {
        return "an Error happened in sign in";
      }
    }
  }

  return (
    <div className="flex justify-center">
      <div className="p-5 rounded-lg">
        <GoogleButton handleGoogleSignIn={handleGoogleSignIn} />
      </div>
    </div>
  );
}
