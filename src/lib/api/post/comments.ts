import { api } from "@/lib/api/axios-instance";
import { ApiResponse } from "@/types/api/response";
import { CommentWithInfo } from "@/types/comment";

export async function fetchPostComments(
  postId: string,
): Promise<CommentWithInfo[]> {
  const response: ApiResponse<CommentWithInfo[]> = (
    await api.get("/comments", {
      params: { postId },
    })
  ).data;

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data!;
}
