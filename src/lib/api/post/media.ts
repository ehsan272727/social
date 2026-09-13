import { Media } from "@/prisma/generated/client";
import { ApiResponse } from "@/types/api/response";
import { api } from "@/lib/api/axios-instance";

export async function fetchPostMedia(postId: string): Promise<Media[]> {
  const media: ApiResponse<Media[]> = (await api.get(`/post/media/${postId}`))
    .data;
  if (media.error) {
    throw new Error(media.error);
  }
  return media.data!;
}
