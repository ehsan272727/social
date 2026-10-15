"use client";

import { Session } from "@/types/auth";
import { UserRound } from "lucide-react";
import Image from "next/image";
import { useState, ChangeEvent } from "react";

interface Props {
  session: Session | null;
}

export function ProfileImage({ session }: Props) {
  const [imageUrl, setImageUrl] = useState(session?.user.image);

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files) {
      setImageUrl(URL.createObjectURL(files[0]));
    }
  };

  return (
    <div>
      <div>
        <input
          type="file"
          id="profile-image-input"
          onChange={handleImageSelect}
          className="hidden"
        />
        {imageUrl ? (
          <label htmlFor="profile-image-input" className="cursor-pointer">
            <div className="w-24 h-24">
              <Image
                className="min-h-0 w-full h-full object-cover object-center rounded-full"
                src={imageUrl}
                alt="profile image"
                width={100}
                height={100}
              />
            </div>
          </label>
        ) : (
          <label htmlFor="profile-image-input" className="cursor-pointer">
            <div className="flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full bg-gray-200 border-2 border-black">
              <UserRound className="size-12 md:size-20" />
            </div>
          </label>
        )}
      </div>
    </div>
  );
}
