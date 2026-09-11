"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api/response";
import { ERROR_MESSAGES } from "@/util/error-messages";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function deletePostAction(
  postId: string,
  revalidationPath?: string,
): Promise<ApiResponse<string>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: ERROR_MESSAGES.auth.not_logged_in };
  }

  try {
    const deletedPost = await prisma.post.deleteMany({
      where: { id: postId, userId: session.user.id },
    });
    if (revalidationPath) {
      revalidatePath(revalidationPath);
    }
    return {
      data:
        deletedPost.count > 0 ? "post was deleted" : "post is already deleted",
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message };
    }
    return { error: ERROR_MESSAGES.unknown.server };
  }
}
