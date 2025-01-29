"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DatePicker = ({
  placeholder = "Pick a date",
  defaultValue = new Date(),
  onChange,
  ...props
}) => {
  const [date, setDate] = useState(defaultValue);

  const [isOpen, setIsOpen] = useState(false);
  const onChangeAction = (date) => {
    setDate(date);
    onChange(date);
    setIsOpen(false);
  };
  return (
    <Popover {...props} onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChangeAction}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
