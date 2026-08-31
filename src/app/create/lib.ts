import { toast } from "@/components/ui/toast";
import { api } from "@/lib/axios-instance";
import { ApiResponse } from "@/types/api/response";
import { S3ResponseObject } from "@/types/file";
import axios from "axios";

export async function uploadFile(file: File): Promise<string | undefined> {
  const uploadInfo: ApiResponse<S3ResponseObject> = (
    await api.post("/s3/upload", {
      fileName: file.name,
      contentType: file.type,
      size: file.size,
    })
  ).data;

  if (uploadInfo.error) {
    toast.add({ type: "error", description: uploadInfo.error });
    throw new Error("Upload failed");
  } else if (uploadInfo.data) {
    await axios.put(uploadInfo.data.presignedUrl, file, {
      headers: { "Content-Type": file.type },
      onUploadProgress(progressEvent) {
        if (typeof progressEvent.progress === "number") {
          const progressPercent = (progressEvent.progress * 100).toFixed(2);
        }
      },
    });
    return uploadInfo.data.key;
  }
}
