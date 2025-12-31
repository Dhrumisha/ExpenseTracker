"use client";

import * as React from "react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import type { IToggleButtonProps } from "./types";

export const ToggleButtonWithProps: React.FC<IToggleButtonProps> = ({
  defaultValue = false,
  disabled,
  onChange,
  name,
  id,
  on,
  off,
  label,
  asterisk = false,
  isInline = false,
  isUsedWithoutPermission = false,
  labelClassName = "",
  wrapperClassName = "",
}) => {

  const isDisabled = isUsedWithoutPermission || disabled;
  const [toggle, setToggle] = React.useState(defaultValue);
  const displayText = toggle ? on || "ON" : off || "OFF";
  const handleChange = (value: boolean) => {
    setToggle(value);
    onChange?.(value);
  };

  React.useEffect(() => {
    setToggle(defaultValue);
  }, [defaultValue]);

  return (
    <div
      className={cn("flex gap-2", isInline ? "lg:flex-row flex-col" : "flex-col", wrapperClassName)}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={id || name}
          className={cn("inline-flex pr-2 align-middle font-semibold text-base", labelClassName)}
        >
          {label}
          {asterisk && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Switch with overlayed text */}
      <div className="relative inline-flex items-center">
        {/* The actual ShadCN Switch */}
        <Switch
          id={id || name}
          checked={toggle}
          onCheckedChange={handleChange}
          disabled={isDisabled}
          className="relative z-10"
        />

        {/* ON / OFF text overlay */}
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center text-[11px] font-medium text-white transition-opacity duration-300 select-none pointer-events-none",
            toggle ? "opacity-100" : "opacity-0"
          )}
        >
          {on || "ON"}
        </span>

        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center text-[11px] font-medium text-white transition-opacity duration-300 select-none pointer-events-none",
            toggle ? "opacity-0" : "opacity-100"
          )}
        >
          {off || "OFF"}
        </span>
      </div>
    </div>
  );
};
