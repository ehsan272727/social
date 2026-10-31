import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Media } from "@/prisma/generated/client";
import Image from "next/image";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useModalStore } from "@/stores/modal-store";

interface Props {
  media?: Media[];
}

export function PostMedia({ media }: Props) {
  const bucketUrl = process.env.NEXT_PUBLIC_BUCKET_URL;
  const [isImageLoading, setIsImageLoading] = useState(true);
  const openModal = useModalStore((store) => store.openModal);

  const openImageViewer = (src: string) => {
    openModal("image-viewer", src);
  };

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
                          onClick={() => openImageViewer(srcUrl)}
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
