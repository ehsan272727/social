import { PostWithInfo } from "@/types/post";
import { AuthUser } from "@/types/user";
import clsx from "clsx";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  user: AuthUser;
  post: PostWithInfo;
}

export function Post({ post, user }: Props) {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-md border">
      <div className="border-b">{post.user.username}</div>
      <h2 className="font-bold">{post.title}</h2>
      {post.content && <p>{post.content}</p>}
      <div className="flex gap-2 items-center pt-1.5 border-t">
        <Button variant="outline" size="icon">
          {<MessageCircle className="size-5" />}
        </Button>
        <Button variant="outline" size="icon">
          {<ThumbsUp className={clsx("size-5", "fill-gray-300")} />}
        </Button>
      </div>
    </div>
  );
}
