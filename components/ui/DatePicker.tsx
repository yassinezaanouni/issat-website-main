"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  date: Date | undefined;
  setDate: (date: Date) => void;
  label: string;
};
export function DatePicker({ date, setDate, label }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"underline"}
          className={cn(
            "w-full justify-start text-left font-medium",
            !date && "font-normal text-slate-700",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
