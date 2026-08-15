"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaceGrinning, SendHorizonal } from "lucide-react";
import { SubmitEvent, useState, useTransition } from "react";
import { Spinner } from "../ui/spinner";
import { createCommentAction } from "@/app/(actions)/comment";
import { toast } from "@/components/ui/toast";
import { ERROR_MESSAGES } from "@/util/error-messages";
import { EmojiPickerPopover } from "./emoji-picker-popover";

interface Props {
  postId: string | null;
}

export function CommentInput({ postId }: Props) {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isSending, startTransition] = useTransition();
  const [content, setContent] = useState("");

  if (!postId) {
    return null;
  }

  const handleCommentSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    startTransition(async () => {
      e.preventDefault();
      if (content.trim().length === 0) {
        setContent("");
        return;
      }

      try {
        const result = await createCommentAction({ postId, content });

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
    <div className="flex gap-1">
      <form onSubmit={handleCommentSubmit} className="flex-1 flex gap-1.5">
        <Textarea
          disabled={isSending}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="enter you comment here"
          className="min-w-0 flex-1 resize-none field-sizing-fixed"
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
            <Button
              size="icon"
              variant="outline"
              disabled={isSending}
              onClick={() => setIsEmojiOpen((prev) => !prev)}
            >
              <FaceGrinning className="size-6" />
            </Button>
          </EmojiPickerPopover>
        </div>
      </form>
    </div>
  );
}
