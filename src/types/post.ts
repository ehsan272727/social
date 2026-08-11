import { Prisma } from "@/prisma/generated/client";

export type PostWithInfo = Prisma.PostGetPayload<{
  include: {
    user: {
      select: {
        username: true;
      };
    };
    _count: {
      select: {
        likes: true;
      };
    };
    likes: {
      where: {
        userId: session.user.id;
      };
      select: {
        userId: true;
      };
    };
  };
}>;
