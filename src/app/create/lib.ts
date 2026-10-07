import { toast } from "@/components/ui/toast";
import { s3Api } from "@/lib/api/axios-instance";
import { ApiResponse } from "@/types/api/response";
import { FileStat, S3ResponseObject } from "@/types/file";
import axios from "axios";

export async function uploadFile(
  fileInfo: FileStat,
  updateProgress: (targetFile: FileStat, progress: number) => void,
): Promise<string | undefined> {
  const uploadInfo: ApiResponse<S3ResponseObject> = (
    await s3Api.post("/upload", {
      fileName: fileInfo.file.name,
      contentType: fileInfo.file.type,
      size: fileInfo.file.size,
    })
  ).data;

  if (uploadInfo.error) {
    toast.add({ type: "error", description: uploadInfo.error });
    throw new Error("Upload failed");
  } else if (uploadInfo.data) {
    await axios.put(uploadInfo.data.presignedUrl, fileInfo.file, {
      headers: {
        "Content-Type": fileInfo.file.type,
        "x-amz-acl": "public-read",
      },
      onUploadProgress(progressEvent) {
        if (typeof progressEvent.progress === "number") {
          const progressPercent = Math.round(
            (progressEvent.progress * 100 * 100) / 100,
          );
          updateProgress(fileInfo, progressPercent);
        }
      },
    });
    return uploadInfo.data.key;
  }
}
