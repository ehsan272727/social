import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ERROR_MESSAGES } from "@/util/error-messages";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const username = req.nextUrl.searchParams.get("username");

  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
        likes: session
          ? {
              where: {
                userId: session.user.id,
              },
              take: 1,
              select: {
                id: true,
              },
            }
          : {
              take: 0,
              select: {
                id: true,
              },
            },
      },
      where: username
        ? {
            user: {
              username,
            },
          }
        : {},
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({ data: posts });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return Response.json({ error: error.message });
    } else {
      return Response.json({ error: ERROR_MESSAGES.unknown.server });
    }
  }
}
