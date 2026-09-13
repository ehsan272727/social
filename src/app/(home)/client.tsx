"use client";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { CommentsDialog } from "@/components/post/comment-dialog";
import { Post } from "@/components/post/post";
import { PostWithInfo } from "@/types/post";
import { useState } from "react";
import { deletePostAction } from "../(actions)/post/post-actions";
import { toast } from "@/components/ui/toast";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "./getPosts";

interface Props {}

export function ClientPage({}: Props) {
  const [isSignInDialogOpen, setSignInDialog] = useState(false);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const isCommentsOpen = commentsPostId !== null;

  const { data: posts, refetch: refetchPosts } = useQuery<
    PostWithInfo[] | undefined
  >({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const handleDeletePost = async (postId: string) => {
    const result = await deletePostAction(postId);

    if (result.error) {
      toast.add({ type: "error", title: result.error });
    } else {
      refetchPosts();
      toast.add({ title: result.data });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-9">
        {posts &&
          posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              selectPostId={(postId) => setCommentsPostId(postId)}
              openSignInDialog={() => setSignInDialog(false)}
              handleDeletePost={() => handleDeletePost(post.id)}
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
