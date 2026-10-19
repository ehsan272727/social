import { appendBucketUrl } from "@/lib/storage/url";
import { User } from "lucide-react";
import Image from "next/image";

interface Props {
  imageKey?: string | null;
}

export function MiniProfileImage({ imageKey }: Props) {
  const src = imageKey ? appendBucketUrl(imageKey) : null;

  return (
    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
      {src ? (
        <Image
          src={src}
          width={36}
          height={36}
          alt="profile image is not available"
          className="w-full h-full object-cover object-center rounded-full"
        />
      ) : (
        <User className="size-7 sm:size-8 opacity-50" />
      )}
    </div>
  );
}
