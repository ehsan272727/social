import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PostWithInfo } from "@/types/post";
import { headers } from "next/headers";
import { ClientPage } from "./client";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const posts: PostWithInfo[] = await prisma.post.findMany({
    include: {
      user: {
        select: {
          username: true,
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
  });

  return (
    <div className="">
      <main className="m-5">
        <ClientPage posts={posts} />
      </main>
    </div>
  );
}
