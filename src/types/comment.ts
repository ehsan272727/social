import { Prisma } from "@/prisma/generated/client";

export type CommentWithInfo = Prisma.CommentGetPayload<{
  include: {
    user: {
      select: {
        username: true;
        displayUsername: true;
        image: true;
      };
    };
  };
}>;
