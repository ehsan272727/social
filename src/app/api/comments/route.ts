import prisma from "@/lib/prisma";
import { ERROR_MESSAGES } from "@/util/error-messages";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const postId = searchParams.get("postId");

  if (!postId) {
    return Response.json(
      {
        error: "Post id is required",
      },
      { status: 400 },
    );
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: {
          equals: null,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            displayUsername: true,
            image: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });
    return Response.json({
      data: comments,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2015") {
        return Response.json(
          {
            error: ERROR_MESSAGES.prisma["P2015"],
          },
          { status: 404 },
        );
      } else {
        return Response.json(
          {
            error: error.message,
          },
          { status: 400 },
        );
      }
    } else {
      return Response.json(
        {
          error: "An unknown error happened",
        },
        { status: 400 },
      );
    }
  }
}
