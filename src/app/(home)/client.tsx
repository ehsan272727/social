"use client";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { CommentsDialog } from "@/components/post/comments-dialog";
import { Post } from "@/components/post/post";
import { PostWithInfo } from "@/types/post";
import { useState } from "react";
import { deletePostAction } from "@/app/(actions)/post/post-actions";
import { toast } from "@/components/ui/toast";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "./getPosts";
import { authClient } from "@/lib/auth-client";

export function ClientPage() {
  const [isSignInDialogOpen, setSignInDialog] = useState(false);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const isCommentsOpen = commentsPostId !== null;

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
              selectPostId={(postId) => setCommentsPostId(postId)}
            />
          ))}
      </div>
      <CommentsDialog
        postId={commentsPostId}
        isOpen={isCommentsOpen}
        user={session?.user}
        handleOpenChange={(open) => {
          if (!open) {
            setCommentsPostId(null);
          }
        }}
      />
    </>
  );
}
