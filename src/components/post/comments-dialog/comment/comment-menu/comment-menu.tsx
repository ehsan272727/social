import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  isDeleting: boolean;
  openEdit: () => void;
  handleDeleteComment: () => void;
}

export function CommentMenu({
  openEdit,
  isDeleting,
  handleDeleteComment,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="w-fit ml-auto">
            <EllipsisVertical className=" size-5.5" />
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={openEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem disabled={isDeleting} onClick={handleDeleteComment}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
