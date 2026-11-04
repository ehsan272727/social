"use client";

import { useModalStore } from "@/stores/modal-store";
import { SignInDialog } from "../auth/sign-in-dialog";
import { MediaViewerDialog } from "../post/post-media";

export function GlobalModals() {
  const modal = useModalStore((state) => state.modal);
  const closeModal = useModalStore((state) => state.closeModal);

  const openChangeHandler = (open: boolean) => {
    if (!open) {
      closeModal();
    }
  };

  return (
    <>
      {modal.type === "sign-in" && (
        <SignInDialog
          isOpen={true}
          title={modal.data?.title || ""}
          handleOpenChange={openChangeHandler}
        />
      )}
      {modal.type === "media-viewer" && (
        <MediaViewerDialog
          fileSrc={modal.data.fileSrc}
          type={modal.data.type}
          isOpen={true}
          handleOpenChange={openChangeHandler}
        />
      )}
    </>
  );
}
