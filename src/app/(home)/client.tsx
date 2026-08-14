"use client";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { CommentsDialog } from "@/components/post/comments-dialog";
import { Post } from "@/components/post/post";
import { PostWithInfo } from "@/types/post";
import { useState } from "react";

interface Props {
  posts: PostWithInfo[];
}

export function ClientPage({ posts }: Props) {
  const [isSignInDialogOpen, setSignInDialog] = useState(false);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const isCommentsOpen = commentsPostId !== null;

  return (
    <>
      <div className="flex flex-col gap-9">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            selectPostId={(postId) => setCommentsPostId(postId)}
            openSignInDialog={() => setSignInDialog(false)}
          />
        ))}
      </div>
      <CommentsDialog
        postId={commentsPostId}
        isOpen={isCommentsOpen}
        handleOpenChange={(open) => {
          if (!open) {
            setCommentsPostId(null);
          }
        }}
      />
      <SignInDialog
        title="Sign in to like and comment"
        isOpen={isSignInDialogOpen}
        handleOpenChange={setSignInDialog}
      />
    </>
  );
}
