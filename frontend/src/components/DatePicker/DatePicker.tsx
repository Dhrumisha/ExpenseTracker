import * as React from "react";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calender";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDateTime } from "@/utils/date";

import { LabelWithProps } from "../Label/Label";

import type { DatePickerHelperProps } from "./types";

export const DatePickerWithProps = ({
  label,
  id,
  value,
  onChange,
  className,
  wrapperClassName,
  labelClassName,
  disabled,
  placeholder = "Select date",
}: DatePickerHelperProps) => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    if (value !== undefined) {
      setDate(value);
    }
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onChange) {
      onChange(selectedDate);
    }
    setOpen(false);
  };

  return (
    <div className={wrapperClassName}>
      {label && (
        <LabelWithProps className={labelClassName} htmlFor={id}>
          {label}
        </LabelWithProps>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            disabled={disabled}
            className={`w-full justify-between font-normal ${className || ""}`}
          >
            {date ? formatDateTime(date, "MM/dd/yyyy", placeholder) : placeholder}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={handleDateSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerWithProps;
