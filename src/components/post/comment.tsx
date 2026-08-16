import { CommentWithInfo } from "@/types/comment";
import { User } from "lucide-react";
import Image from "next/image";

interface Props {
  data: CommentWithInfo;
}

export function Comment({ data }: Props) {
  const userPageLink = `/user/${data.user.username}`;

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
        </div>
      </div>
    </div>
  );
}
