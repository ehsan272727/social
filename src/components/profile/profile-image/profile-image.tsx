"use client";

import { toast } from "@/components/ui/toast";
import { usersApi } from "@/lib/api/axios-instance";
import { uploadFile } from "@/lib/api/upload";
import { appendBucketUrl } from "@/lib/storage/url";
import { ApiResponse } from "@/types/api/response";
import { Session } from "@/types/auth";
import { FileStat } from "@/types/file";
import { UserRound } from "lucide-react";
import Image from "next/image";
import { useState, ChangeEvent } from "react";

interface Props {
  session: Session | null;
}

export function ProfileImage({ session }: Props) {
  const [file, setFile] = useState<FileStat | null>(null);
  const userImageProfile = session?.user.image
    ? appendBucketUrl(session.user.image)
    : "";

  const updateProgress = (targetFile: FileStat, progress: number) => {
    setFile((prev) => ({ ...prev!, progress }));
  };

  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    let newFile = {};
    if (files) {
      newFile = {
        file: files[0],
        progress: 0,
        uploading: true,
        objectUrl: URL.createObjectURL(files[0]),
      };
      setFile(newFile as FileStat);
    } else {
      return;
    }

    try {
      const imageUrl = await uploadFile(
        newFile as FileStat,
        "profile",
        updateProgress,
      );

      if (!imageUrl) throw new Error();

      const response: ApiResponse<string> = await usersApi.patch("/me/avatar", {
        imageUrl,
      });

      console.log(response);
      if (response.error) {
        toast.add({ type: "error", title: response.error });
        return;
      }
      toast.add({ type: "success", title: response.data });
    } catch (error) {
      toast.add({ type: "error", title: "Uploading image failed" });
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
        {file?.objectUrl || userImageProfile ? (
          <label htmlFor="profile-image-input" className="cursor-pointer">
            <div className="w-24 h-24">
              <Image
                className="min-h-0 w-full h-full object-cover object-center rounded-full"
                src={file?.objectUrl || userImageProfile}
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
