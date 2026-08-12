"use client";

import { Post } from "@/components/post/post";
import { PostWithInfo } from "@/types/post";

interface Props {
  posts: PostWithInfo[];
}

export function ClientPage({ posts }: Props) {
  console.log(posts);
  return (
    <div className="flex flex-col gap-9">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
