import * as React from "react";

import { CircleQuestionMark } from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { cn } from "@/lib/utils";

import LabelWithProps from "../Label/Label";
import { TooltipWithProps } from "../Tooltip/TooltipWithProps";

import type { ISelectProps } from "./types";

export const SelectWithProps: React.FC<ISelectProps> = ({
  label,
  tooltip,
  tooltipIcon,
  asterisk,
  name,
  id,
  placeholder = "Select an option",
  options,
  defaultValue,
  onChange,
  disabled,
  isUsedWithoutPermission = false,
  isInline = false,
  labelClassName = "",
  wrapperClassName = "",
  contentClassName = "",
}) => {
  const permissions = useUserPermissions();
  const showAction = permissions?.isSuperUser || permissions?.canEdit || permissions?.canDelete;

  const isDisabled = isUsedWithoutPermission ? false : !showAction || disabled;

  const [value, setValue] = React.useState(defaultValue || "");

  React.useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  const handleChange = (val: string) => {
    setValue(val);
    onChange?.(val);
  };

  const labelEl = label && <LabelWithProps required={asterisk}>{label}</LabelWithProps>;

  const tooltipEL = tooltip && (
    <TooltipWithProps content={tooltip}>
      {tooltipIcon || <CircleQuestionMark size={16} className="text-gray-500 cursor-pointer" />}
    </TooltipWithProps>
  );

  return (
    <div
      className={cn("flex gap-2", isInline ? "lg:flex-row flex-col" : "flex-col", wrapperClassName)}
    >
      <div className="flex gap-2">
        {labelEl}
        {tooltipEL}
      </div>

      <Select
        disabled={isDisabled}
        onValueChange={handleChange}
        defaultValue={defaultValue?.toString() || ""}
        value={value?.toString() || ""}
      >
        <SelectTrigger
          id={id || name}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors " +
              "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground " +
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            isDisabled && "opacity-60 cursor-not-allowed"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={cn(contentClassName)}>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value.toString()} disabled={opt.disabled}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
