"use client";

import { Post } from "@/components/post/post";
import { PostWithInfo } from "@/types/post";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "./getPosts";
import { authClient } from "@/lib/auth-client";

export function ClientPage() {
  const { data: session } = authClient.useSession();

  const { data: posts, refetch: refetchPosts } = useQuery<
    PostWithInfo[] | undefined
  >({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  return (
    <>
      <div className="flex flex-col gap-9">
        {posts &&
          posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              user={session?.user}
              refetchPosts={refetchPosts}
            />
          ))}
      </div>
    </>
  );
}
