"use client";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import { ReactElement } from "react";
import { Emoji } from "frimousse";

interface Props {
  children: ReactElement;
  handleEmojiSelect: (emoji: Emoji) => void;
}

export function EmojiPickerPopover({ children, handleEmojiSelect }: Props) {
  return (
    <Popover>
      <PopoverTrigger render={children} />
      <PopoverContent align="center">
        <PopoverDescription>Hey</PopoverDescription>
        <EmojiPicker className="h-80" onEmojiSelect={handleEmojiSelect}>
          <EmojiPickerSearch />
          <EmojiPickerContent />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
}
