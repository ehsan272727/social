import { create } from "zustand";

type ModalType = "sign-in" | "alert";

type ModalStore = {
  type: ModalType | null;
  data?: string | null;
  openModal: (type: ModalType, data?: string | null) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  data: null,

  openModal: (type, data = null) => set({ type, data }),

  closeModal: () => set({ type: null, data: null }),
}));
