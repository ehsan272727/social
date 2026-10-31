import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface Props {
  imageSrc: string;
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
}

export function ImageViewerDialog({
  imageSrc,
  isOpen,
  handleOpenChange,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <TransformWrapper>
          <TransformComponent>
            <picture>
              <img src={imageSrc} alt="image viewer for post"></img>
            </picture>
          </TransformComponent>
        </TransformWrapper>
      </DialogContent>
    </Dialog>
  );
}
