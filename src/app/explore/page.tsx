"use client";

import { SearchInput } from "@/components/search";

interface Props {}

export default function Page({}: Props) {
  const handleSearch = () => {};

  return (
    <div className="flex justify-center">
      <div className="max-w-100 flex-1">
        <SearchInput onSearch={handleSearch}></SearchInput>
      </div>
    </div>
  );
}
