import { authClient } from "@/lib/auth-client";

export type AuthUser = typeof authClient.$Infer.Session.user;
