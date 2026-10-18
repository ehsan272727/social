import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { imageUrl: newImageUrl } = await req.json();

  if (!newImageUrl) {
    return Response.json(
      { error: "Image url was not present" },
      { status: 404 },
    );
  }

  try {
    await prisma.user.update({
      data: { image: newImageUrl },
      where: { id: session?.user.id },
    });
    return Response.json({ data: "Successfully updated user" });
  } catch (error) {
    return Response.json(
      { error: "a database error happened" },
      { status: 500 },
    );
  }
}
