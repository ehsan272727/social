import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./s3";

interface Props {
  key: string;
  contentType: string;
  size: number;
  ACL?: ObjectCannedACL;
}

export async function createUploadUrl({
  key,
  contentType,
  size,
  ACL = "public-read",
}: Props): Promise<string> {
  const putCommand = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    ACL,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
  });

  return getSignedUrl(s3Client, putCommand, {
    expiresIn: 100,
  });
}
