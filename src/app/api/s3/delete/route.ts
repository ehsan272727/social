import { s3Client } from "@/lib/storage/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  console.log("DELETE MEDIA :::::::");
  try {
    const body = await req.json();
    const objectKey = body.key;
    console.log("==== Object Key is ====");
    console.log(objectKey);

    if (!objectKey) {
      return Response.json({ error: "Key is required" }, { status: 400 });
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.STORAGE_BUCKET_NAME as string,
      Key: objectKey,
    });

    await s3Client.send(command);

    return Response.json(
      {
        data: "Data was successfully deleted ",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete file",
      },
      { status: 500 },
    );
  }
}
