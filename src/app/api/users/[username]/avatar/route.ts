import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  try {
    const userInfo = await prisma.user.findFirst({
      select: {
        image: true,
      },
      where: {
        username,
      },
    });

    if (userInfo) {
      return NextResponse.json({ data: userInfo?.image });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "getting profile image failed",
      },
      { status: 500 },
    );
  }
}
