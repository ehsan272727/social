"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action";
import { ERROR_MESSAGES } from "@/util/error-messages";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { headers } from "next/headers";

interface Props {
  parentCommentId: string;
  content: string;
  postId: string;
}

export async function createReplyAction({
  parentCommentId,
  content,
  postId,
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
    if (parentCommentId && content) {
      await prisma.comment.create({
        data: {
          userId: session.user.id,
          parentId: parentCommentId,
          content,
          postId,
        },
      });
    }

    return { success_message: "comment was added" };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message };
    }
    return { error: ERROR_MESSAGES.unknown.server };
  }
}
