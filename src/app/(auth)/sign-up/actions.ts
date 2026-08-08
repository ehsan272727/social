"use server";

import { auth } from "@/lib/auth";
import { SignUpFormOutput, SignUpServerSchema } from "@/lib/validators";
import { ActionResponse } from "@/types/action";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { isAPIError } from "better-auth/api";

export async function signUpAction(
  formOutput: Partial<SignUpFormOutput>,
): Promise<ActionResponse> {
  const validation = await SignUpServerSchema.safeParseAsync(formOutput);

  if (!validation.success) {
    return { error: "Some information is wrong" };
  }

  const { data } = validation;

  try {
    const userData = await auth.api.signUpEmail({
      body: {
        email: data.email,
        name: data.name,
        password: data.password,
        username: data.username,
        displayUsername: data.displayUsername,
      },
    });
    return { success_message: "User was added" };
  } catch (err) {
    if (isAPIError(err)) {
      return { error: err.message };
    } else if (err instanceof PrismaClientKnownRequestError) {
      return { error: "A database error happened" };
    }
    return { error: "An unknown error happened" };
  }
}
