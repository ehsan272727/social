"use client";

import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { usersApi } from "@/lib/api/axios-instance";
import { uploadFile } from "@/lib/api/upload";
import { deleteProfileImages } from "@/lib/storage/profile-image";
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
      if (session?.user) {
        deleteProfileImages(session.user);
      }
      const imageUrl = await uploadFile(
        newFile as FileStat,
        "profile",
        updateProgress,
      );

      if (!imageUrl) throw new Error();

      const response: ApiResponse<string> = await usersApi.patch("/me/avatar", {
        imageUrl,
      });

      if (response.error) {
        toast.add({ type: "error", title: response.error });
        setFile((prev) => ({ ...prev!, uploading: false }));
        return;
      }
      toast.add({ type: "success", title: "Profile image updated" });
    } catch (error) {
      toast.add({ type: "error", title: "Uploading image failed" });
    } finally {
      setFile((prev) => ({ ...prev!, uploading: false }));
    }
  };

  return (
    <div>
      <div className="relative w-24 h-24">
        <input
          type="file"
          id="profile-image-input"
          onChange={handleImageSelect}
          className="hidden"
        />
        {file?.objectUrl || userImageProfile ? (
          <>
            <label htmlFor="profile-image-input" className="cursor-pointer">
              <Image
                className="min-h-0 w-full h-full object-cover object-center rounded-full"
                src={file?.objectUrl || userImageProfile}
                alt="profile image"
                width={100}
                height={100}
              />
            </label>
            {file?.uploading && (
              <Spinner
                className="w-full h-full absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-300"
                style={{
                  opacity: `${65 - file.progress * 0.3}%`,
                }}
              />
            )}
          </>
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
