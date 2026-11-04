import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface Props {
  fileSrc: string;
  type: "image" | "video";
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
}

export function MediaViewerDialog({
  fileSrc,
  type,
  isOpen,
  handleOpenChange,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <TransformWrapper>
          <TransformComponent>
            {type === "image" && (
              <picture>
                <img src={fileSrc} alt="image viewer for post"></img>
              </picture>
            )}
            {type === "video" && (
              <video controls={true}>
                <source src={fileSrc}></source>
              </video>
            )}
          </TransformComponent>
        </TransformWrapper>
      </DialogContent>
    </Dialog>
  );
}
