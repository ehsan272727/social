import { api } from "@/lib/api/axios-instance";
import { ApiResponse } from "@/types/api/response";
import { PostWithInfo } from "@/types/post";

export async function getPosts() {
  const response: ApiResponse<PostWithInfo[]> = (await api.get("/posts")).data;

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data;
}
