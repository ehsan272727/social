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
    parent: {
      select: {
        user: {
          select: {
            displayUsername: true;
          };
        };
        parent: {
          select: {
            parentId: true;
          };
        };
      };
    };
    _count: {
      select: {
        replies: true;
      };
    };
    // likes: {
    //   select: {
    //     id: true;
    //   };
    //   take: 1;
    // };
  };
}>;

export interface CommentEditState {
  enabled: boolean;
  commentId: string;
  textContent: string;
}
