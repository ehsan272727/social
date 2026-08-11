"use client";

import { Post } from "@/components/post/post";
import { PostWithInfo } from "@/types/post";
import { AuthUser } from "@/types/user";
import { useState } from "react";

interface Props {
  user: AuthUser;
  posts: PostWithInfo[];
}

export function ClientPage({ posts, user }: Props) {
  return (
    <div className="flex flex-col gap-9">
      {posts.map((post) => (
        <Post key={post.id} post={post} user={user} />
      ))}
    </div>
  );
}
