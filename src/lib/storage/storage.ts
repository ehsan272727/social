import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./s3";

interface Props {
  key: string;
  contentType: string;
  size: number;
}

export async function createUploadUrl({
  key,
  contentType,
  size,
}: Props): Promise<string> {
  const putCommand = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    ACL: "public-read",
    Key: key,
    ContentType: contentType,
    ContentLength: size,
  });

  return getSignedUrl(s3Client, putCommand, {
    expiresIn: 360,
  });
}
