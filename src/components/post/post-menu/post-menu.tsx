import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAlertStore } from "@/stores/alert-store";

interface Props {
  isOwnPost: boolean;
  deletePost: () => void;
}

export function PostMenu({ isOwnPost, deletePost }: Props) {
  const confirm = useAlertStore((state) => state.confirm);

  const onDelete = async () => {
    const isConfirmed = await confirm({
      title: "Delete this post?",
    });

    if (isConfirmed) {
      deletePost();
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" className="w-fit ml-auto">
              <EllipsisVertical className="size-5.5" />
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {isOwnPost && (
              <DropdownMenuItem onClick={onDelete}>
                Delete post
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
