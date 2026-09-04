import { toast } from "@/components/ui/toast";
import { api } from "@/lib/axios-instance";
import { Media } from "@/prisma/generated/client";
import { ApiResponse } from "@/types/api/response";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

interface Props {
  postId: string;
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

export function PostMedia({ postId }: Props) {
  const { data: media } = useQuery<Media[]>({
    queryKey: ["post-media", postId],
    queryFn: () => fetchMedia(postId),
  });

  const bucketUrl = process.env.NEXT_PUBLIC_BUCKET_URL;

  return (
    <div>
      {media && (
        <div>
          {media.map((file) => {
            const srcUrl = `${bucketUrl}/${file.key}`;
            return (
              <div key={file.id} className="relative w-24 h-24 rounded-md">
                {file.type === "image" ? (
                  <Image
                    src={srcUrl}
                    alt=""
                    fill={true}
                    className="rounded-md"
                  />
                ) : (
                  <video controls={true}>
                    <source src={srcUrl}></source>
                  </video>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
