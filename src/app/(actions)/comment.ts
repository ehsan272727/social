"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Post } from "@/prisma/generated/client";
import { ActionResponse } from "@/types/action";
import { ERROR_MESSAGES } from "@/util/error-messages";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { headers } from "next/headers";

interface Props {
  content: string;
  post: Post;
}

export async function createCommentAction({
  content,
  post,
}: Props): Promise<ActionResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: ERROR_MESSAGES.auth.not_logged_in };
  }

  if (typeof content !== "string" || content.length === 0) {
    return {
      error: ERROR_MESSAGES.comment.empty,
    };
  }
  try {
    await prisma.comment.create({
      data: {
        content,
        postId: post.id,
        userId: session.user.id,
      },
    });

    return { success_message: "comment was added" };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message };
    }
    return { error: ERROR_MESSAGES.unknown.server };
  }
}
