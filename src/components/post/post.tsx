"use client";

import { PostWithInfo } from "@/types/post";
import clsx from "clsx";
import { MessageCircle, ThumbsUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LikeAction } from "@/app/(actions)/post/like";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { getProfileLink } from "@/lib/get-profile-link";
import { getRelativeTime } from "@/lib/time";
import { PostMedia } from "./post-media/post-media";
import { PostMenu } from "./post-menu";
import { useQuery } from "@tanstack/react-query";
import { Media } from "@/prisma/generated/client";
import { api, s3Api } from "@/lib/api/axios-instance";
import { ApiResponse } from "@/types/api/response";
import { formatLikes } from "@/lib/post";

interface Props {
  post: PostWithInfo;
  selectPostId: (postId: string) => void;
  openSignInDialog: () => void;
  handleDeletePost: () => void;
}

async function fetchMedia(postId: string): Promise<Media[]> {
  try {
    const media: ApiResponse<Media[]> = (await api.get(`/post/media/${postId}`))
      .data;
    if (media.error) {
      throw new Error("");
    }
    return media.data!;
  } catch (error) {
    toast.add({
      type: "error",
      description: "Error happened while getting post media",
    });
    return [];
  }
}

export function Post({
  post,
  selectPostId,
  openSignInDialog,
  handleDeletePost,
}: Props) {
  const { data: session } = authClient.useSession();
  const [likeState, setLikeState] = useState({
    isLiked: post.likes?.length > 0,
    count: post._count.likes,
  });
  const formattedLikes = formatLikes(likeState.count);
  const userProfileLink = getProfileLink(post.user.username);

  const { data: media } = useQuery<Media[]>({
    queryKey: ["post-media", post.id],
    queryFn: () => fetchMedia(post.id),
  });

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

  const handleDelete = async () => {
    if (media) {
      for (const mediaObj of media) {
        const result: ApiResponse<string> = (
          await s3Api.delete("/delete", {
            data: { key: mediaObj.key },
          })
        ).data;

        if (result.error) {
          toast.add({ type: "error", title: result.error });
        }
      }
    }
    handleDeletePost();
  };

  return (
    <div>
      <div className="mx-auto max-w-96 flex flex-col gap-2 rounded-md border">
        <div className="flex justify-between items-center p-2 border-b">
          <div className="flex items-center gap-2">
            <div className="w-fit border rounded-full">
              <a href={userProfileLink}>
                <span className="w-7 h-7 sm:w-8 s:h-8 rounded-full">
                  {post.user.image ? (
                    <Image
                      src={post.user.image}
                      alt="profile image is not available"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="size-7 sm:size-8 opacity-50" />
                  )}
                </span>
              </a>
            </div>
            <a href={userProfileLink}>{post.user.username}</a>
          </div>
          <PostMenu
            isOwnPost={session?.user.id === post.userId}
            deletePost={handleDelete}
          />
        </div>
        <h2 className="p-2 font-bold">{post.title}</h2>
        {post.content && <p className="p-2">{post.content}</p>}
        <PostMedia media={media} />
        <div className="flex flex-col gap-2 p-2 border-t">
          <p className="text-xs md:text-sm">
            Posted {getRelativeTime(post.createdAt)}
          </p>
          <div className="flex gap-2 items-center">
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
      </div>
    </div>
  );
}
