import React, { useState } from "react";

import { useField } from "formik";
import { Check, ChevronsUpDown, X, CircleQuestionMark } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";
import { LabelWithProps } from "../Label/Label";
import { TooltipWithProps } from "../Tooltip/TooltipWithProps";

// Type definitions
interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected?: string[];
  onChange?: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  maxDisplay?: number;
  disabled?: boolean;
  formik?: boolean;
  errorMessage?: string;
  name?: string;
  displayError?: boolean;
  label?: string;
  required?: boolean;
  tooltip?: string;
  tooltipIcon?: React.ReactNode;
  labelClassName?: string;
  wrapperClassName?: string;
  id?: string;
  isInline?: boolean;
  isUsedWithoutPermission?: boolean;
  showSearch?: boolean;
}

// MultiSelect Component
export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected: selectedProp,
  onChange: onChangeProp,
  placeholder = "Select items...",
  className,
  maxDisplay = 3,
  disabled = false,
  formik = false,
  errorMessage: errorMessageProp,
  name,
  displayError = true,
  label,
  required,
  tooltip,
  tooltipIcon,
  labelClassName,
  wrapperClassName,
  id,
  isInline,
  isUsedWithoutPermission = false,
  showSearch = true,
}) => {

  const isDisabled = isUsedWithoutPermission || disabled;
  const [open, setOpen] = useState(false);

  // Formik integration - use useField when formik=true and name is provided
  // Always call useField to satisfy React hooks rules, but only use it when formik=true
  const fieldName = formik && name ? name : "__multiselect_dummy__";
  const [field, meta, helpers] = useField<string[]>(fieldName);

  const isFormikMode = formik && name && fieldName !== "__multiselect_dummy__";

  // Determine selected value: Formik mode uses field.value, otherwise use prop
  const selected = isFormikMode ? field.value || [] : selectedProp || [];

  const fieldId = id || name || "multiselect";
  const fieldError = isFormikMode ? meta.error : errorMessageProp;
  const hasError = isFormikMode ? meta.touched && meta.error : Boolean(errorMessageProp);
  const showError = Boolean(displayError && hasError && fieldError);

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];

    if (isFormikMode) {
      helpers.setValue(newSelected);
      helpers.setTouched(true, false);
    }
    if (onChangeProp) {
      onChangeProp(newSelected);
    }
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = selected.filter((item) => item !== value);

    if (isFormikMode) {
      helpers.setValue(newSelected);
      helpers.setTouched(true, false);
    }
    if (onChangeProp) {
      onChangeProp(newSelected);
    }
  };

  const selectedOptions = options.filter((opt) => selected.includes(opt.value));
  const displayOptions = selectedOptions.slice(0, maxDisplay);
  const remainingCount = selectedOptions.length - maxDisplay;

  return (
    <div
      className={cn("flex gap-2", isInline ? "lg:flex-row flex-col" : "flex-col", wrapperClassName)}
    >
      {label && (
        <div className="flex gap-2">
          <LabelWithProps className={labelClassName} required={required} htmlFor={fieldId}>
            {label}
          </LabelWithProps>
          {tooltip && (
            <TooltipWithProps content={tooltip}>
              {tooltipIcon || (
                <CircleQuestionMark size={16} className="text-gray-500 cursor-pointer" />
              )}
            </TooltipWithProps>
          )}
        </div>
      )}
      <div className="space-y-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={fieldId}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(" w-150 justify-between h-auto min-h-10 text-black", className)}
              disabled={isDisabled}
              aria-invalid={!!showError}
              aria-describedby={showError ? `${fieldId}-error` : undefined}
            >
              <div className="flex flex-wrap gap-1 flex-1">
                {selected.length === 0 ? (
                  <span className="text-gray-500">{placeholder}</span>
                ) : (
                  <>
                    {displayOptions.map((option) => (
                      <Badge key={option.value} variant="secondary" className="mr-1">
                        {option.label}
                        <div
                          role="button"
                          tabIndex={0}
                          className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer inline-flex items-center"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleRemove(option.value, e as any);
                            }
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={(e) => handleRemove(option.value, e)}
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </div>
                      </Badge>
                    ))}
                    {remainingCount > 0 && (
                      <Badge variant="secondary" className="mr-1">
                        +{remainingCount} more
                      </Badge>
                    )}
                  </>
                )}
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0 bg-white"
            align="start"
          >
            <Command className="bg-white">
              {showSearch && (
                <CommandInput
                  placeholder="Search..."
                  className="bg-white text-black placeholder:text-gray-500"
                />
              )}
              <CommandList className="bg-white">
                <CommandEmpty className="text-gray-500">No results found.</CommandEmpty>
                <CommandGroup className="bg-white">
                  {options.map((option, index) => {
                    const isSelected = selected.includes(option.value);
                    // Use option.value as the CommandItem value to ensure unique identification
                    // even when labels are duplicated
                    return (
                      <CommandItem
                        key={`${option.value}-${index}`}
                        value={option.label}
                        onSelect={() => handleSelect(option.value)}
                        className="bg-white hover:bg-gray-100 text-black"
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
                        />
                        {option.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <FormErrorMessage error={fieldError} id={`${fieldId}-error`} displayError={showError} />
      </div>
    </div>
  );
};
