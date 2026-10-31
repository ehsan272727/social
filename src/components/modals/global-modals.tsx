"use client";

import { useModalStore } from "@/stores/modal-store";
import { SignInDialog } from "../auth/sign-in-dialog";
import { ImageViewerDialog } from "../post/post-media";

export function GlobalModals() {
  const type = useModalStore((state) => state.type);
  const data = useModalStore((state) => state.data);
  const closeModal = useModalStore((state) => state.closeModal);

  const openChangeHandler = (open: boolean) => {
    if (!open) {
      closeModal();
    }
  };

  return (
    <>
      {type === "sign-in" && (
        <SignInDialog
          isOpen={true}
          title={data || ""}
          handleOpenChange={openChangeHandler}
        />
      )}
      {type === "image-viewer" && (
        <ImageViewerDialog
          imageSrc={data || ""}
          isOpen={true}
          handleOpenChange={openChangeHandler}
        />
      )}
    </>
  );
}
