import { Prisma } from "@/prisma/generated/client";

export type PostWithInfo = Prisma.PostGetPayload<{
  include: {
    user: {
      select: {
        username: true;
        image: true;
      };
    };
    _count: {
      select: {
        likes: true;
      };
    };
    likes:
      | {
          where: {
            userId: string;
          };
          take: 1;
          select: {
            userId: true;
          };
        }
      | {
          take: 0;
          select: {
            id: true;
          };
        };
  };
}>;
