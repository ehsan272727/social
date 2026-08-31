import { auth } from "@/lib/auth";
import { createUploadUrl } from "@/lib/storage";
import { ERROR_MESSAGES } from "@/util/error-messages";
import { headers } from "next/headers";
import { z } from "zod";

const uploadRequestSchema = z.object({
  fileName: z.string(),
  contentType: z.string(),
  size: z.number(),
});

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return Response.json(
      { error: ERROR_MESSAGES.auth.not_logged_in },
      {
        status: 401,
      },
    );
  }

  const body = await req.json();
  const validation = uploadRequestSchema.safeParse(body);

  if (!validation.success) {
    return Response.json(
      {
        error: ERROR_MESSAGES.file.not_valid,
      },
      { status: 400 },
    );
  }

  const { fileName, contentType, size } = body;

  // if (!contentType.startsWith("image/") && !contentType.startsWith("video/")) {
  //   return Response.json(
  //     {
  //       error: ERROR_MESSAGES.file.not_valid,
  //     },
  //     { status: 400 },
  //   );
  // }

  const extension = fileName.split(".").pop();

  const key = `users/${session.user.id}/posts/${crypto.randomUUID()}.${extension}`;

  try {
    const uploadUrl = await createUploadUrl({
      key,
      contentType,
      size,
    });

    return Response.json({ data: { presignedUrl: uploadUrl, key } });
  } catch (error) {
    return Response.json({
      error: "An error happened while creating upload url",
    });
  }
}
