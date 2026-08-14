"use client";

import { Drawer, DrawerHeader, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "usehooks-ts";
import { CommentInput } from "../inputs/comment-input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ApiResponse } from "@/types/api/response";
import { Comment } from "@/prisma/generated/client";
import { CommentsListSkeleton } from "@/components/skeleton-ui/comment-skeleton";
import { useEffect } from "react";

interface Props {
  postId: string | null;
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
}

async function getComments(postId: string) {
  const response = await axios.get("/api/comments", {
    params: { postId },
  });

  return response.data;
}

export function CommentsDialog({ postId, isOpen, handleOpenChange }: Props) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const { data: comments, isFetching } = useQuery<ApiResponse<Comment[]>>({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId!),
    enabled: postId !== null,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && postId) {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    }
  }, [isOpen, queryClient, postId]);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={handleOpenChange}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerContent>
        <DrawerHeader className="pb-1 font-bold text-lg border-b">
          Comments
        </DrawerHeader>
        <div className="p-2">
          <CommentInput postId={postId} />
          {comments?.data && !isFetching && (
            <div className="flex flex-col">
              {comments.data.map((comment) => (
                <div key={comment.id}>{comment.content}</div>
              ))}
            </div>
          )}
          {isFetching && (
            <div className="mt-3">
              <CommentsListSkeleton />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
