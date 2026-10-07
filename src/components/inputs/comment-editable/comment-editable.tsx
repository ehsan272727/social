import { Button } from "@/components/ui/button";
import { useMutationState } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface Props {
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  content: string;
  handleEdit: (newContent: string) => void;
  editQueryKey: string[];
}

type EditVariables = {
  commentId: string;
  newContent: string;
};

export function CommentEditable({
  isEditing,
  setIsEditing,
  content,
  editQueryKey,
  handleEdit,
}: Props) {
  const pendingEdit = useMutationState<EditVariables>({
    filters: { mutationKey: editQueryKey, status: "pending" },
    select: (mutation) => mutation.state.variables as EditVariables,
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const currContent =
    pendingEdit.length > 0 ? pendingEdit[0].newContent : content;

  const handleCancel = () => setIsEditing(false);

  const handleSave = () => {
    handleEdit(inputRef.current ? inputRef.current.value : "");
    setIsEditing(false);
  };

  return (
    <div>
      {!isEditing ? (
        <p>{currContent}</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          <textarea
            ref={inputRef}
            defaultValue={currContent}
            className="resize-none h-auto rounded-md px-1.5 py-0.5 outline outline-primary "
          />
          <div className="flex gap-1.5 items-center">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      <div></div>
    </div>
  );
}
