export const ERROR_MESSAGES = {
  auth: {
    not_logged_in: "you must be logged in",
    not_authorized: "you are not authorized for this action",
  },

  comment: {
    empty: "comment is empty",
    empty_id: "comment id is not present",
    not_found: "comment not found",
    no_post_id: "no post id was present",
    no_parent_comment_id: "comment id is not present",
  },

  unknown: {
    server: "an unknown server error happened",
  },

  prisma: {
    P2015: "did not find the record",
  },
};
