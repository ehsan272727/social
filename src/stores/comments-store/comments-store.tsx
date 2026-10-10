import { create } from "zustand";

type CommentsStore = {
  isOpen: boolean;
  postId: string | null;

  openComments: (postId: string) => void;
  closeComments: () => void;
};

export const useCommentsStore = create<CommentsStore>((set) => ({
  isOpen: false,
  postId: null,

  openComments: (postId) => set({ isOpen: true, postId }),
  closeComments: () => set({ isOpen: false, postId: null }),
}));
