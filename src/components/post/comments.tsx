import { CommentWithInfo } from "@/types/comment";
import { ChevronDown, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ReplyInput } from "@/components/inputs/reply-input";

interface Props {
  data: CommentWithInfo;
}

export function Comment({ data }: Props) {
  const userPageLink = `/user/${data.user.username}`;
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  return (
    <div key={data.id} className="pb-2">
      <div className="flex gap-2">
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
            className="font-bold text-gray-500"
            href={userPageLink}
            aria-label="username"
          >
            {data.user.displayUsername}
          </a>
          <p>{data.content}</p>

          <button
            onClick={() => setIsReplyOpen((prev) => !prev)}
            className="mt-2 self-start opacity-70 hover:opacity-100"
          >
            Reply
          </button>
          {data._count.replies > 0 && (
            <button className="mt-4 mr-8">
              <div className="flex items-center gap-1">
                <div className="w-5 h-px bg-primary"></div>
                <span>View {data._count.replies} replies</span>
                <ChevronDown className="size-5.5" />
              </div>
            </button>
          )}
        </div>
      </div>
      {isReplyOpen && (
        <div className="mt-3">
          <ReplyInput comment={data} />
        </div>
      )}
    </div>
  );
}
