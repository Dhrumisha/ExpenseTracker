"use client";

import React from "react";

import { useField } from "formik";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import type { SwitchWithProps as SwitchWithPropsProps } from "./types";

export const SwitchWithProps: React.FC<SwitchWithPropsProps> = ({
  name,
  label,
  helperText,
  required = false,
  disabled = false,
  containerClassName,
  className,
  switchPosition = "left",
  onCheckedChange,
}) => {
  const [field, meta, helpers] = useField({ name, type: "checkbox" });

  const showError = meta.touched && meta.error;
  const switchId = `switch-${name}`;
  const errorId = `${switchId}-error`;
  const helperId = `${switchId}-helper`;

  const handleChange = (checked: boolean) => {
    helpers.setValue(checked);
    helpers.setTouched(true);
    onCheckedChange?.(checked);
  };

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <div
        className={cn(
          "flex items-center gap-3",
          switchPosition === "right" && "flex-row-reverse justify-end"
        )}
      >
        <Switch
          id={switchId}
          checked={!!field.value}
          onCheckedChange={handleChange}
          disabled={disabled}
          aria-invalid={showError ? "true" : "false"}
          aria-describedby={cn(showError && errorId, helperText && helperId)}
          className={cn(showError && "ring-2 ring-destructive ring-offset-2", className)}
        />

        {label && (
          <Label
            htmlFor={switchId}
            className={cn(
              "text-sm font-medium leading-none cursor-pointer",
              disabled && "opacity-50 cursor-not-allowed",
              showError && "text-destructive"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
      </div>

      {helperText && !showError && (
        <p
          id={helperId}
          className={cn("text-sm text-muted-foreground", switchPosition === "left" && "ml-12")}
        >
          {helperText}
        </p>
      )}

      {showError && (
        <p
          id={errorId}
          role="alert"
          className={cn(
            "text-sm font-medium text-destructive",
            switchPosition === "left" && "ml-12"
          )}
        >
          {meta.error}
        </p>
      )}
    </div>
  );
};

export default SwitchWithProps;
