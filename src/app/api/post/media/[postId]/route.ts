import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;
  console.log("Hey from post media");

  if (!postId) {
    return Response.json({
      error: "No post id was sent",
    });
  }

  try {
    const files = await prisma.media.findMany({
      where: {
        postId,
      },
    });

    return Response.json({ data: files });
  } catch (error) {
    return Response.json({ error: "error while getting files" });
  }
}
