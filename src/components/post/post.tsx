"use client";

import { PostWithInfo } from "@/types/post";
import clsx from "clsx";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { likeAction } from "@/app/(actions)/post/like";
import { toast } from "@/components/ui/toast";
import { getProfileLink } from "@/lib/get-profile-link";
import { getRelativeTime } from "@/lib/time";
import { PostMedia } from "./post-media/post-media";
import { PostMenu } from "./post-menu";
import { useQuery } from "@tanstack/react-query";
import { Media } from "@/prisma/generated/client";
import { s3Api } from "@/lib/api/axios-instance";
import { ApiResponse } from "@/types/api/response";
import { formatLikes } from "@/lib/post";
import { fetchPostMedia } from "@/lib/api/post/media";
import { AuthUser } from "@/types/user";
import { deletePostAction } from "@/app/(actions)/post/post-actions";
import { useModalStore } from "@/stores/modal-store";
import { useCommentsStore } from "@/stores/comments-store";
import { MiniProfileImage } from "./mini-profile-image";

interface Props {
  post: PostWithInfo;
  user?: AuthUser;
  refetchPosts: () => void;
}

export function Post({ post, user, refetchPosts }: Props) {
  const openModal = useModalStore((store) => store.openModal);
  const openComments = useCommentsStore((store) => store.openComments);
  const [likeState, setLikeState] = useState({
    isLiked: post.likes?.length > 0,
    count: post._count.likes,
  });
  const formattedLikes = formatLikes(likeState.count);
  const userProfileLink = getProfileLink(post.user.username);

  const {
    data: media,
    isError,
    error,
  } = useQuery<Media[]>({
    queryKey: ["post-media", post.id],
    queryFn: () => fetchPostMedia(post.id),
  });

  const openSignInDialog = () => {
    openModal("sign-in", "sign in to like and comment");
  };

  useEffect(() => {
    if (isError) {
      toast.add({ type: "error", title: error.message });
    }
  }, [isError, error?.message]);

  const handleLikeToggle = async () => {
    if (!user) {
      openSignInDialog();
      return;
    }
    const previous = likeState;
    setLikeState({
      isLiked: !previous.isLiked,
      count: previous.isLiked ? previous.count - 1 : previous.count + 1,
    });

    try {
      const result = await likeAction({
        postId: post.id,
        isLiked: !previous.isLiked,
      });
      if (result.error) {
        setLikeState(previous);
        toast.add({ type: "error", description: result.error });
      }
    } catch (error) {
      setLikeState(previous);
      toast.add({ type: "error", description: "An unknown error happened" });
    }
  };

  const handleDelete = async () => {
    let isMediaDeleted = true;
    if (media) {
      for (const mediaObj of media) {
        const result: ApiResponse<string> = (
          await s3Api.delete("/delete", {
            data: { key: mediaObj.key },
          })
        ).data;

        if (result.error) {
          isMediaDeleted = false;
          toast.add({ type: "error", title: result.error });
          break;
        }
      }
    }
    if (!isMediaDeleted) {
      return;
    }

    const result = await deletePostAction(post.id);

    if (result.error) {
      toast.add({ type: "error", title: result.error });
    } else {
      toast.add({ title: result.data });
      refetchPosts();
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-96 flex flex-col gap-2 rounded-md border">
        <div className="flex justify-between items-center p-2 border-b">
          <div className="flex items-center gap-2">
            <div className="w-fit border rounded-full">
              <a href={userProfileLink}>
                <MiniProfileImage imageKey={post.user.image} />
              </a>
            </div>
            <a href={userProfileLink}>{post.user.username}</a>
          </div>
          <PostMenu
            isOwnPost={user?.id === post.userId}
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
              onClick={() => openComments(post.id)}
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
