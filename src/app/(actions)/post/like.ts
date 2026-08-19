"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/action";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { headers } from "next/headers";

interface Props {
  postId: string;
  isLiked: boolean;
}

export async function LikeAction({
  postId,
  isLiked,
}: Props): Promise<ActionResponse<null>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "User is not logged in" };
  }

  try {
    if (isLiked) {
      await prisma.like.create({
        data: {
          userId: session.user.id,
          postId,
        },
      });
    } else {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId,
          },
        },
      });
    }

    return { data: null };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "post is already liked by you" };
      }
      return { error: error.message };
    } else {
      return { error: "An unknown error happened" };
    }
  }
}
