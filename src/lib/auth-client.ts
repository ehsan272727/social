import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: process.env.GOOGLE_CLIENT_ID,
});

export const { signIn, signUp, useSession } = createAuthClient();
