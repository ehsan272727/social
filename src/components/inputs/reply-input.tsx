"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaceGrinning, SendHorizonal } from "lucide-react";
import { SubmitEvent, useState, useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { ERROR_MESSAGES } from "@/util/error-messages";
import { EmojiPickerPopover } from "./emoji-picker-popover";
import { CommentWithInfo } from "@/types/comment";
import clsx from "clsx";
import { createReplyAction } from "@/app/(actions)/(post)/reply";

interface Props {
  comment: CommentWithInfo;
}

export function ReplyInput({ comment }: Props) {
  const [isSending, startTransition] = useTransition();
  const [content, setContent] = useState("");

  const handleCommentSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    startTransition(async () => {
      e.preventDefault();
      if (content.trim().length === 0) {
        setContent("");
        return;
      }

      try {
        const result = await createReplyAction({
          parentCommentId: comment.id,
          content,
          postId: comment.postId,
        });

        if ("error" in result) {
          toast.add({ type: "error", description: result.error });
          return;
        }
        setContent("");
      } catch (error) {
        toast.add({
          type: "error",
          description: ERROR_MESSAGES.unknown.server,
        });
      }
    });
  };

  return (
    <div className={clsx("flex gap-1 ml-5")}>
      <form onSubmit={handleCommentSubmit} className="flex-1 flex gap-1.5">
        <Textarea
          disabled={isSending}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Replying to ${comment?.user.displayUsername}`}
          className="min-w-0  flex-1 resize-none field-sizing-fixed"
        ></Textarea>
        <div className="flex flex-col gap-1.5">
          <Button
            size="icon"
            variant="outline"
            type="submit"
            disabled={isSending || content.length === 0}
          >
            {isSending ? (
              <Spinner className="size-6" />
            ) : (
              <SendHorizonal className="size-6" />
            )}
          </Button>

          <EmojiPickerPopover
            handleEmojiSelect={(emoji) =>
              setContent((prev) => prev + emoji.emoji)
            }
          >
            <Button size="icon" variant="outline" disabled={isSending}>
              <FaceGrinning className="size-6" />
            </Button>
          </EmojiPickerPopover>
        </div>
      </form>
    </div>
  );
}
