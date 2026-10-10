"use client";

import { useModalStore } from "@/stores/modal-store";
import { SignInDialog } from "../auth/sign-in-dialog";

export function GlobalModals() {
  const type = useModalStore((state) => state.type);
  const data = useModalStore((state) => state.data);
  const closeModal = useModalStore((state) => state.closeModal);

  return (
    <>
      {type === "sign-in" && (
        <SignInDialog
          isOpen={true}
          title={data || ""}
          handleOpenChange={(open: boolean) => {
            if (!open) closeModal();
          }}
        />
      )}
    </>
  );
}
