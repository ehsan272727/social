"use client";

import { PostWithInfo } from "@/types/post";
import { Drawer, DrawerHeader, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "usehooks-ts";
import { CommentInput } from "../inputs/comment-input";

interface Props {
  post: PostWithInfo;
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
}

export function CommentDialog({ post, isOpen, handleOpenChange }: Props) {
  const isMobile = useMediaQuery("(max-width: 640px)");

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
          <CommentInput post={post} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
