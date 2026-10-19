import { CommentWithInfo } from "@/types/comment";
import { ChevronDown, ChevronUp, Play, Reply, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ReplyInput } from "@/components/inputs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api/response";
import { CommentsListSkeleton } from "@/components/skeleton-ui/comment-skeleton";
import { CommentMenu } from "./comment-menu";
import {
  deleteCommentAction,
  editCommentAction,
} from "@/app/(actions)/post/comment";
import { api } from "@/lib/api/axios-instance";
import { getRelativeTime } from "@/lib/time";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { CommentEditable } from "@/components/inputs/comment-editable/comment-editable";
import { AuthUser } from "@/types/user";
import { appendBucketUrl } from "@/lib/storage/url";
import { MiniProfileImage } from "../../mini-profile-image";

interface Props {
  isReply?: boolean;
  data: CommentWithInfo;
  isDeletingComment?: boolean;
  user?: AuthUser;
  handleDeleteComment?: (commentId: string) => void;
  handleDeleteReply?: (commentId: string) => void;
}

async function getReplies(parentId: string) {
  const response: ApiResponse<CommentWithInfo[]> = (
    await api.get("/replies", {
      params: { parentId },
    })
  ).data;

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data!;
}

export function Comment({
  data,
  isReply = false,
  user,
  handleDeleteComment,
  isDeletingComment = false,
}: Props) {
  const userPageLink = data ? `/profile/${data.user.username}` : "#";
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();
  const queryKey = isReply
    ? ["replies", data.parentId!]
    : ["comments", data.postId!];
  const editMutationKey = ["edit", data.id];

  const { data: replies, isFetching } = useQuery<CommentWithInfo[]>({
    queryKey: ["replies", data.id],
    queryFn: () => getReplies(data.id),
    enabled: showReplies,
  });

  const repliesCount = useMemo(() => {
    return replies ? replies.length : data._count.replies;
  }, [replies, data._count.replies]);

  const { isPending: isDeletingReply, mutate: deleteReplyMutate } = useMutation(
    {
      mutationFn: (commentId: string) => deleteCommentAction({ commentId }),

      onSuccess: (response) => {
        queryClient.setQueryData<CommentWithInfo[]>(
          queryKey,

          (prev) => {
            if (!prev) return [];

            return prev.filter((data) => data.id !== response.data);
          },
        );
      },
    },
  );

  const { isPending: isEditPending, mutate: editMutate } = useMutation({
    mutationFn: async ({
      commentId,
      newContent,
    }: {
      commentId: string;
      newContent: string;
    }) => {
      const result = await editCommentAction({ commentId, newContent });

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    mutationKey: editMutationKey,
    onSuccess: (_, editedComment) =>
      queryClient.setQueryData<CommentWithInfo[]>(queryKey, (oldComments) => {
        if (!oldComments) return [];
        if (editedComment.newContent.trim().length === 0) {
          return oldComments.filter(
            (comment) => comment.id !== editedComment.commentId,
          );
        }
        return oldComments.map((comment) =>
          comment.id === editedComment.commentId
            ? { ...comment, content: editedComment.newContent }
            : comment,
        );
      }),
  });

  function handleReplyToggle() {
    setShowReplies((prev) => !prev);
  }

  function scrollToComment(commentId: string) {
    const commentEl = document.getElementById(`comment-${commentId}`);

    if (!commentEl) return;

    commentEl.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    commentEl.classList.add("highlight-comment");

    setTimeout(() => {
      commentEl.classList.remove("highlight-comment");
    }, 500);
  }

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["replies", data.id] });
  }, [showReplies]);

  return (
    <div className="pb-2">
      <div id={`comment-${data.id}`} className="mt-2 flex gap-2 rounded-md">
        {/* User profile image */}
        <div className="h-fit">
          <div className="border rounded-full">
            <a href={userPageLink}>
              <MiniProfileImage imageKey={user?.image} />
            </a>
          </div>
        </div>
        {/* User info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 font-bold text-gray-500">
            {/* ----- Show which user the comment is repling to in level 2 upwards comments */}
            <Link aria-label="username" href={userPageLink}>
              {data.user.displayUsername}
            </Link>
            {data.parent && data.parent?.parent && (
              <button
                onClick={() => scrollToComment(data.parentId!)}
                className="flex items-center gap-1"
              >
                <Play className="size-3 fill-primary" />
                {data.parent.user.displayUsername}
              </button>
            )}
          </div>
          <div aria-label="comment content" className="mt-1 text-base">
            {user && user.id === data.userId ? (
              <CommentEditable
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editQueryKey={editMutationKey}
                content={data.content}
                handleEdit={(newContent: string) =>
                  editMutate({ commentId: data.id, newContent })
                }
              />
            ) : (
              data.content
            )}
          </div>
          {/* ---- How long ago was the comment sent ---- */}
          <p
            aria-label="when was the comment sent"
            className="mt-1.5 text-xs md:text-sm opacity-60"
          >
            {getRelativeTime(data.createdAt)}
          </p>

          {/* ---- Reply button for opening the reply input ---- */}
          {user && (
            <button
              onClick={() => {
                setShowReplies(true);
                setIsReplyOpen((prev) => !prev);
              }}
              className="mt-2 self-start flex items-center gap-1 opacity-70 hover:opacity-100"
            >
              <Reply className="size-4.5 sm:size-5" />
              Reply
            </button>
          )}
          {/* ------- Show replies Button ------- */}
          {repliesCount > 0 && (
            <button
              onClick={handleReplyToggle}
              className="mt-4 opacity-70 hover:opacity-100"
            >
              <div className="flex items-center gap-1">
                <div className="w-5 h-px bg-primary"></div>
                <span>
                  {showReplies ? "Hide" : "View"} {repliesCount} replies
                </span>
                {showReplies ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown className="size-5.5" />
                )}
              </div>
            </button>
          )}
        </div>
        {/* Show comment menu if the comment belongs to the logged in user */}
        {user && user.id === data.userId && (
          <CommentMenu
            openEdit={() => setIsEditing(true)}
            handleDeleteComment={
              isReply
                ? () => deleteReplyMutate(data.id)
                : () => handleDeleteComment!(data.id)
            }
            isDeleting={isReply ? isDeletingReply : isDeletingComment}
          />
        )}
      </div>
      {/* ---------- Replies ---------- */}

      <div className={!data.parentId ? "ml-9" : ""}>
        <AnimatePresence>
          {showReplies && replies && !isFetching && (
            <motion.div
              transition={{ layout: { delay: 0.1 } }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AnimatePresence>
                {replies.map((reply) => (
                  <motion.div
                    key={reply.id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    layout
                  >
                    <Comment
                      data={reply}
                      isReply={true}
                      user={user}
                      handleDeleteReply={() => deleteReplyMutate(reply.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        {showReplies && isFetching && (
          <CommentsListSkeleton count={repliesCount} />
        )}
      </div>

      {/* ---------- Open reply input on reply button click ------- */}
      {isReplyOpen && (
        <div className="mt-3">
          <ReplyInput
            comment={data}
            closeReplyInput={() => setIsReplyOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
