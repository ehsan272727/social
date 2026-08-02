"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Search } from "lucide-react";

interface Props {
  onSearch: () => void;
}

export function SearchInput({}: Props) {
  return (
    <form>
      <ButtonGroup className="w-full">
        <Input
          id="search-input"
          type="search"
          placeholder="Search..."
          className="py-4.5 border-primary"
        />
        <Button className="py-4.5 border-primary">
          <span className="hidden md:inline">Search</span>
          <Search className="size-6 md:size-4.5" />
        </Button>
      </ButtonGroup>
    </form>
  );
}
