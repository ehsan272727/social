"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  PostCreateInput,
  PostCreateWithoutUserInput,
} from "@/prisma/generated/models";
import { ActionResponse } from "@/types/action";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { headers } from "next/headers";

export async function createPost(
  data: PostCreateWithoutUserInput,
): Promise<ActionResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "User is not logged in" };
  }

  try {
    await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        userId: session.user.id,
      },
    });
    return { success_message: "post was created" };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message };
    }
    return { error: "An unknown error happened(server)" };
  }
}
