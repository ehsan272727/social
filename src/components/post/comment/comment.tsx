import { CommentWithInfo } from "@/types/comment";
import { ChevronDown, ChevronUp, Play, Reply, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ReplyInput } from "@/components/inputs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api/response";
import { CommentSkeleton } from "@/components/skeleton-ui/comment-skeleton";
import { CommentMenu } from "@/components/post/comment-menu";
import { authClient } from "@/lib/auth-client";
import { deleteCommentAction } from "@/app/(actions)/post/comment";
import { api } from "@/lib/axios-instance";
import { getRelativeTime } from "@/lib/time";

interface Props {
  isReply?: boolean;
  data: CommentWithInfo;
  isDeletingComment?: boolean;
  handleDeleteComment?: (commentId: string) => void;
  handleDeleteReply?: (commentId: string) => void;
}

async function getReplies(parentId: string) {
  const response = await api.get("/replies", {
    params: { parentId },
  });

  return response.data;
}

export function Comment({
  data,
  isReply = false,
  handleDeleteComment,
  isDeletingComment = false,
}: Props) {
  const userPageLink = data ? `/profile/${data.user.username}` : "#";
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const { data: session } = authClient.useSession();

  const queryClient = useQueryClient();

  const { data: replies, isFetching } = useQuery<
    ApiResponse<CommentWithInfo[]>
  >({
    queryKey: ["replies", data.id],
    queryFn: () => getReplies(data.id),
    enabled: showReplies,
  });

  const repliesCount = useMemo(() => {
    return replies?.data ? replies.data.length : data._count.replies;
  }, [replies?.data, data._count.replies]);

  const { isPending: isDeletingReply, mutate: deleteReplyMutate } = useMutation(
    {
      mutationFn: (commentId: string) => deleteCommentAction({ commentId }),

      onSuccess: (response) => {
        queryClient.setQueryData<ApiResponse<CommentWithInfo[]>>(
          ["replies", data.parentId],

          (prev) => {
            if (!prev?.data) return { data: [] };

            return {
              data: prev.data.filter((data) => data.id !== response.data),
            };
          },
        );
      },
    },
  );

  function handleReplyToggle() {
    setShowReplies((prev) => !prev);
  }

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["replies", data.id] });
  }, [showReplies]);

  return (
    <div key={data.id} className="pb-2">
      <div className="mt-2 flex gap-2">
        <div className="h-fit">
          <div className="border rounded-full">
            <a href={userPageLink}>
              <span className="w-7 h-7 sm:w-8 s:h-8 rounded-full">
                {data.user.image ? (
                  <Image
                    src={data.user.image}
                    alt="profile image is not available"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="size-7 sm:size-8 opacity-50" />
                )}
              </span>
            </a>
          </div>
        </div>
        <div className="flex flex-col">
          <a
            className="flex items-center gap-1 font-bold text-gray-500"
            href={userPageLink}
          >
            {/* ----- Show which user the comment is repling to in level 2 upwards comments */}
            <div aria-label="username">{data.user.displayUsername}</div>
            {data.parent && data.parent?.parent && (
              <>
                <Play className="size-3 fill-primary" />
                {data.parent.user.displayUsername}
              </>
            )}
          </a>
          <p aria-label="comment content" className="mt-1 text-base">
            {data.content}
          </p>
          {/* ---- How long ago was the comment sent ---- */}
          <p
            aria-label="when was the comment sent"
            className="mt-1.5 text-xs md:text-sm opacity-60"
          >
            {getRelativeTime(data.createdAt)}
          </p>

          {/* ---- Reply button for opening the reply input ---- */}
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
        {session && session.user.id === data.userId && (
          <CommentMenu
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
        {showReplies &&
          replies?.data &&
          !isFetching &&
          replies.data.map((reply) => (
            <Comment
              key={reply.id}
              data={reply}
              isReply={true}
              handleDeleteReply={() => deleteReplyMutate(reply.id)}
            />
          ))}
        {showReplies && isFetching && <CommentSkeleton />}
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
