"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api/response";
import { CommentWithInfo } from "@/types/comment";
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
}: Props): Promise<ApiResponse<CommentWithInfo>> {
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
  if (!parentCommentId) {
    return {
      error: ERROR_MESSAGES.comment.no_parent_comment_id,
    };
  }
  try {
    const addedReply: CommentWithInfo = await prisma.comment.create({
      data: {
        userId: session.user.id,
        parentId: parentCommentId,
        content,
        postId,
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

    return { data: addedReply };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message };
    }
    return { error: ERROR_MESSAGES.unknown.server };
  }
}
