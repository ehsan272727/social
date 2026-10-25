"use server";

import { DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "../s3";
import { AuthUser } from "@/types/user";

export async function deleteProfileImages(user: AuthUser): Promise<boolean> {
  const bucketName = process.env.STORAGE_BUCKET_NAME as string;
  const listCommand = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: `users/${user.id}/profile`,
  });
  try {
    const listedObjects = await s3Client.send(listCommand);
    if (listedObjects.Contents && listedObjects.Contents.length > 0) {
      const deleteObjects = listedObjects.Contents.map((obj) => ({
        Key: obj.Key,
      }));
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
          Objects: deleteObjects,
          Quiet: false,
        },
      });
      await s3Client.send(deleteCommand);
    }
    return "ok";
  } catch (error) {
    return "error";
  }
}
