"use client";

import { PostWithInfo } from "@/types/post";
import clsx from "clsx";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LikeAction } from "@/app/(actions)/like";
import { toast } from "../ui/toast";
import { authClient } from "@/lib/auth-client";

interface Props {
  post: PostWithInfo;
  selectPostId: (postId: string) => void;
  openSignInDialog: () => void;
}

function formatLikes(likes: number) {
  if (likes < 1000) {
    return likes;
  } else if (likes >= 1000 && likes < 1000000) {
    return `${(likes / 1000).toFixed(2)}K`;
  } else if (likes >= 1000000) {
    return `${(likes / 1000000).toFixed(2)}M`;
  }
}

export function Post({ post, selectPostId, openSignInDialog }: Props) {
  const { data: session } = authClient.useSession();
  const [likeState, setLikeState] = useState({
    isLiked: post.likes?.length > 0,
    count: post._count.likes,
  });
  const formattedLikes = formatLikes(likeState.count);

  const handleLikeToggle = async () => {
    if (!session) {
      openSignInDialog();
      return;
    }
    const previous = likeState;
    setLikeState({
      isLiked: !previous.isLiked,
      count: previous.isLiked ? previous.count - 1 : previous.count + 1,
    });

    try {
      const result = await LikeAction({
        postId: post.id,
        isLiked: !previous.isLiked,
      });
      if ("error" in result) {
        setLikeState(previous);
        toast.add({ type: "error", description: result.error });
      }
    } catch (error) {
      setLikeState(previous);
      toast.add({ type: "error", description: "An unknown error happened" });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 rounded-md border">
        <div className="p-2 border-b">{post.user.username}</div>
        <h2 className="p-2 font-bold">{post.title}</h2>
        {post.content && <p className="p-2">{post.content}</p>}
        <div className="flex gap-2 items-center p-2 border-t">
          <Button
            variant="outline"
            size="icon"
            onClick={handleLikeToggle}
            className="w-max px-1 gap-1"
          >
            {likeState.count > 0 && <span>{formattedLikes}</span>}
            <ThumbsUp
              className={clsx(
                "size-5 md:size-6",
                likeState.isLiked && "text-green-900 fill-gray-300",
              )}
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => selectPostId(post.id)}
            className="w-max px-1 gap-1"
          >
            {<MessageCircle className="size-5 md:size-6" />}
          </Button>
        </div>
      </div>
    </>
  );
}
