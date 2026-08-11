import { Prisma } from "@/prisma/generated/client";

export type PostWithInfo = Prisma.PostGetPayload<{
  include: {
    user: {
      select: {
        username: true;
      };
    };
    likes: {
      select: {
        userId: true;
      };
    };
  };
}>;
