import { create } from "zustand";

type AlertOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

type AlertStore = {
  options: AlertOptions | null;
  resolve: ((value: boolean) => void) | null;

  confirm: (options: AlertOptions) => Promise<boolean>;
  respond: (result: boolean) => void;
};

export const useAlertStore = create<AlertStore>((set, get) => ({
  options: null,
  resolve: null,

  confirm: (options) =>
    new Promise<boolean>((resolve) => {
      set({
        options,
        resolve,
      });
    }),

  respond: (result) => {
    get().resolve?.(result);

    set({
      options: null,
      resolve: null,
    });
  },
}));
