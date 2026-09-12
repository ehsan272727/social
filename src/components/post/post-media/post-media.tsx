import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api/axios-instance";
import { Media } from "@/prisma/generated/client";
import { ApiResponse } from "@/types/api/response";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

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
  const [isImageLoading, setIsImageLoading] = useState(true);

  const { data: media } = useQuery<Media[]>({
    queryKey: ["post-media", postId],
    queryFn: () => fetchMedia(postId),
  });

  const bucketUrl = process.env.NEXT_PUBLIC_BUCKET_URL;

  return (
    <div>
      {media && (
        <div className="p-2">
          <Carousel>
            <CarouselContent>
              {media.map((file) => {
                const srcUrl = `${bucketUrl}/${file.key}`;
                return (
                  <CarouselItem
                    key={file.id}
                    className="basis-full flex justify-center items-center"
                  >
                    {file.type === "image" ? (
                      <div className="relative max-w-60 w-full aspect-square">
                        <Image
                          src={srcUrl}
                          alt=""
                          fill={true}
                          className="object-contain rounded-md"
                          style={{ opacity: isImageLoading ? "0%" : "100%" }}
                          onLoad={() => setIsImageLoading(false)}
                          onError={() => setIsImageLoading(false)}
                        />
                        {isImageLoading && (
                          <Spinner className="absolute inset-0 size-8" />
                        )}
                      </div>
                    ) : (
                      <video controls={true}>
                        <source src={srcUrl}></source>
                      </video>
                    )}
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </div>
  );
}
