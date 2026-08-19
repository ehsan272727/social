"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Comment } from "@/prisma/generated/client";
import { ActionResponse } from "@/types/action";
import { CommentWithInfo } from "@/types/comment";
import { ERROR_MESSAGES } from "@/util/error-messages";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { headers } from "next/headers";

interface CreateProps {
  content: string;
  postId?: string;
}

export async function createCommentAction({
  content,
  postId,
}: CreateProps): Promise<ActionResponse<CommentWithInfo>> {
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

  if (!postId) {
    return {
      error: ERROR_MESSAGES.comment.no_post_id,
    };
  }

  try {
    const addedComment: CommentWithInfo = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            username: true,
            displayUsername: true,
            image: true,
          },
        },
        parent: {
          select: {
            user: {
              select: {
                displayUsername: true,
              },
            },
            parent: {
              select: {
                parentId: true,
              },
            },
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    return { data: addedComment };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message };
    }
    return { error: ERROR_MESSAGES.unknown.server };
  }
}

interface DeleteProps {
  commentId: string;
}

export async function deleteCommentAction({
  commentId,
}: DeleteProps): Promise<ActionResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: ERROR_MESSAGES.auth.not_logged_in };
  }

  if (typeof commentId !== "string" || commentId.length === 0) {
    return {
      error: ERROR_MESSAGES.comment.empty_id,
    };
  }

  try {
    const result = await prisma.comment.deleteMany({
      where: {
        id: commentId,
        userId: session.user.id,
      },
    });
    if (result.count === 0) {
      return {
        error: `${ERROR_MESSAGES.comment.not_found} or ${ERROR_MESSAGES.auth.not_authorized}`,
      };
    }

    return { success_message: "comment was added" };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message };
    }
    return { error: ERROR_MESSAGES.unknown.server };
  }
}
