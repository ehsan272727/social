"use client";

import { Drawer, DrawerHeader, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "usehooks-ts";
import { CommentInput } from "@/components/inputs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api/response";
import { CommentsListSkeleton } from "@/components/skeleton-ui/comment-skeleton";
import { useEffect } from "react";
import { CommentWithInfo } from "@/types/comment";
import { Comment } from "@/components/post/comment";
import { deleteCommentAction } from "@/app/(actions)/post/comment";
import { api } from "@/lib/api/axios-instance";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  postId: string | null;
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
}

async function getComments(postId: string) {
  const response = await api.get("/comments", {
    params: { postId },
  });

  return response.data;
}

export function CommentsDialog({ postId, isOpen, handleOpenChange }: Props) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const queryClient = useQueryClient();

  const { data: comments, isFetching } = useQuery<
    ApiResponse<CommentWithInfo[]>
  >({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId!),
    enabled: postId !== null,
  });

  const {
    mutate: deleteCommentMutate,
    isPending: isDeletingComment,
    variables,
  } = useMutation({
    mutationFn: (commentId: string) => deleteCommentAction({ commentId }),

    onSuccess: (response) => {
      queryClient.setQueryData<ApiResponse<CommentWithInfo[]>>(
        ["comments", postId],

        (prev) => {
          if (!prev?.data) return { data: [] };

          return {
            data: prev.data.filter((data) => data.id !== response.data),
          };
        },
      );
    },
  });

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
      swipeDirection={isMobile ? "up" : "right"}
    >
      <DrawerContent>
        <DrawerHeader className="pb-1 font-bold text-lg border-b">
          Comments
        </DrawerHeader>
        <div className="p-2">
          <CommentInput postId={postId} />
        </div>
        <div className="p-2 overflow-y-auto">
          <AnimatePresence>
            {comments?.data && !isFetching && (
              <motion.div
                className="mt-2 flex flex-col gap-5"
                transition={{ layout: { delay: 0.1 } }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AnimatePresence>
                  {comments.data.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      layout
                    >
                      <Comment
                        data={comment}
                        handleDeleteComment={(commentId) =>
                          deleteCommentMutate(commentId)
                        }
                        isDeletingComment={
                          isDeletingComment && variables === comment.id
                        }
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
          {isFetching && (
            <div className="mb-3">
              <CommentsListSkeleton count={1} />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
