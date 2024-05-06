import React from "react";
import { Input } from "./ui/input";

interface SearchFieldProps {
  items: Array<{ [key: string]: string }> | undefined;
  setFilteredItems: (items: Array<{ [key: string]: string }>) => void;
  attr?: string;
}

function SearchField({
  items,
  setFilteredItems,
  attr = "name",
}: SearchFieldProps) {
  console.log(items);
  return (
    <Input
      className="mb-6 w-[40rem]"
      placeholder="Rechercher"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        if (!items) return console.error("items is undefined");
        const value = event.target.value;
        if (value === "") setFilteredItems(items);
        else
          setFilteredItems(
            items?.filter((item) =>
              item[attr].toLowerCase().includes(value.toLowerCase()),
            ),
          );
      }}
    />
  );
}

export default SearchField;
