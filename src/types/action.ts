export type ActionResponse =
  | {
      error: string;
    }
  | { success_message: string };
