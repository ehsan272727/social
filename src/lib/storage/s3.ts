import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "default",
  endpoint: process.env.STORAGE_URL_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY as string,
    secretAccessKey: process.env.STORAGE_SECRET_KEY as string,
  },
});
