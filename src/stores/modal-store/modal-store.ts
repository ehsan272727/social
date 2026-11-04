import { create } from "zustand";

type ModalState =
  | { type: null }
  | { type: "sign-in"; data?: { title: string } }
  | { type: "alert"; data: { message: string } }
  | {
      type: "media-viewer";
      data: {
        fileSrc: string;
        type: "image" | "video";
      };
    };

type ModalStore = {
  modal: ModalState;

  openModal: (modal: Exclude<ModalState, { type: null }>) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  modal: { type: null },

  openModal: (modal) => set({ modal }),

  closeModal: () => set({ modal: { type: null } }),
}));
