import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogIn, UserRoundPlus } from "lucide-react";
import Link from "next/link";

interface Props {
  title?: string;
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
}

export function SignInDialog({
  title = "Please sign in to continue",
  isOpen,
  handleOpenChange,
}: Props) {
  return (
    <div className="flex flex-col">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="self-center capitalize">
              {title}
            </DialogTitle>
            <DialogDescription className="flex flex-col items-center gap-4 justify-evenly mt-2">
              <Link
                href="/sign-in"
                onClick={() => handleOpenChange(false)}
                className="w-fit flex items-center gap-1 no-underline! px-1.5 py-0.5 text-black rounded-md border  md:text-xl"
              >
                Sign in <LogIn className="size-6" />
              </Link>
              <Link
                href="/sign-up"
                onClick={() => handleOpenChange(false)}
                className="w-fit flex items-center gap-1 no-underline! px-1.5 py-0.5 text-black rounded-md border  md:text-xl"
              >
                Sign up <UserRoundPlus className="size-6" />
              </Link>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
