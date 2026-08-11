import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PostWithInfo } from "@/types/post";
import { headers } from "next/headers";
import { ClientPage } from "./client";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let myPosts: PostWithInfo[] = [];

  if (session?.user.id) {
    myPosts = await prisma.post.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="">
      <main className="m-5">
        <ClientPage posts={myPosts} user={session?.user} />
      </main>
    </div>
  );
}
