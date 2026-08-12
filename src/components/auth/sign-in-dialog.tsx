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
  title: string;
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
}

export function SignInDialog({ title, isOpen, handleOpenChange }: Props) {
  return (
    <div className="flex flex-col">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="self-center">{title}</DialogTitle>
            <DialogDescription className="flex justify-evenly  mt-2">
              <Link
                href="/sign-in"
                className="w-fit flex items-center gap-1 no-underline! px-1.5 py-0.5 bg-primary text-white rounded-md border text-lg  md:text-xl"
              >
                Sign in <LogIn className="size-6" />
              </Link>
              <Link
                href="/sign-up"
                className="w-fit flex items-center gap-1 no-underline! px-1.5 py-0.5 text-black rounded-md border text-lg  md:text-xl"
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
