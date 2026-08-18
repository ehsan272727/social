import { CommentWithInfo } from "@/types/comment";
import { ChevronDown, ChevronUp, Play, Reply, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ReplyInput } from "@/components/inputs/reply-input";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api/response";
import { CommentSkeleton } from "../skeleton-ui/comment-skeleton";
import { CommentMenu } from "./comment-menu";
import { authClient } from "@/lib/auth-client";
import { deleteCommentAction } from "@/app/(actions)/post/comment";

interface Props {
  isReply?: boolean;
  data: CommentWithInfo;
  isDeletingComment?: boolean;
  handleDeleteComment?: (commentId: string) => void;
  handleDeleteReply?: (commentId: string) => void;
}

async function getReplies(parentId: string) {
  const response = await axios.get("/api/replies", {
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
  const userPageLink = `/user/${data.user.username}`;
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);
  const { data: session } = authClient.useSession();

  const { data: replies, isFetching } = useQuery<
    ApiResponse<CommentWithInfo[]>
  >({
    queryKey: ["replies", parentId],
    queryFn: () => getReplies(parentId!),
    enabled: parentId !== null,
  });

  const { isPending: isDeletingReply, mutate: deleteReplyMutate } = useMutation(
    {
      mutationFn: (commentId: string) => deleteCommentAction({ commentId }),
    },
  );

  function handleReplyToggle() {
    setParentId((prev) => (prev === null ? data.id : null));
  }

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
            aria-label="username"
          >
            {/* ----- Show which user the comment is repling to in level 2 upwards comments */}
            {data.user.displayUsername}
            {data.parent && data.parent?.parent && (
              <>
                <Play className="size-3 fill-primary" />
                {data.parent.user.displayUsername}
              </>
            )}
          </a>
          <p>{data.content}</p>
          {/* ---- Reply button for opening the reply input ---- */}
          <button
            onClick={() => setIsReplyOpen((prev) => !prev)}
            className="mt-2 self-start flex items-center gap-1 opacity-70 hover:opacity-100"
          >
            <Reply className="size-4.5 sm:size-5" />
            Reply
          </button>
          {/* ------- Show replies Button ------- */}
          {data._count.replies > 0 && (
            <button
              onClick={handleReplyToggle}
              className="mt-4 opacity-70 hover:opacity-100"
            >
              <div className="flex items-center gap-1">
                <div className="w-5 h-px bg-primary"></div>
                <span>
                  {parentId ? "Hide" : "View"} {data._count.replies} replies
                </span>
                {parentId ? (
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
        {replies &&
          !isFetching &&
          replies.data?.map((reply) => (
            <Comment
              key={reply.id}
              data={reply}
              isReply={true}
              handleDeleteReply={() => deleteReplyMutate(reply.id)}
            />
          ))}
        {parentId && isFetching && <CommentSkeleton />}
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
