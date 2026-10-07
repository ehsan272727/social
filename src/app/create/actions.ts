"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  MediaCreateManyInput,
  PostCreateWithoutUserInput,
} from "@/prisma/generated/models";
import { ApiResponse } from "@/types/api/response";
import { ERROR_MESSAGES } from "@/util/error-messages";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { headers } from "next/headers";

export async function createPost(
  data: PostCreateWithoutUserInput,
): Promise<ApiResponse<string>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: ERROR_MESSAGES.auth.not_logged_in };
  }

  try {
    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        userId: session.user.id,
      },
    });
    return { data: post.id };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message };
    }
    return { error: "An unknown error happened(server)" };
  }
}

export async function createMultipleMedia(
  data: MediaCreateManyInput[],
): Promise<ApiResponse<string>> {
  try {
    await prisma.media.createMany({
      data,
    });
    return { data: "media was created" };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message };
    }
    return { error: "An unknown error happened(server)" };
  }
}
