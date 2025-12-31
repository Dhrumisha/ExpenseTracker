// src/components/common/CommonCheckbox/index.tsx

"use client";

import React from "react";

import { useField } from "formik";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { CheckboxWithProps as CheckboxWithPropsProps } from "./types";

/**
 * CommonCheckbox Component
 *
 * A reusable checkbox component that integrates ShadCN Checkbox with Formik
 * Handles boolean values and preserves all default ShadCN styles
 *
 * @example
 * <CommonCheckbox
 *   name="agreeToTerms"
 *   label="I agree to the terms and conditions"
 *   required
 * />
 */
export const CheckboxWithProps: React.FC<CheckboxWithPropsProps> = ({
  name,
  label,
  helperText,
  required = false,
  disabled = false,
  containerClassName,
  className,
  checkboxPosition = "left",
  onCheckedChange,
  ...checkboxProps
}) => {
  // Formik integration
  const [field, meta, helpers] = useField({
    name,
    type: "checkbox",
  });

  // Determine if we should show error
  const showError = meta.touched && meta.error;

  // Generate unique IDs
  const checkboxId = `checkbox-${name}`;
  const errorId = `${checkboxId}-error`;
  const helperId = `${checkboxId}-helper`;

  // Handle checkbox change
  const handleCheckedChange = (checked: boolean) => {
    helpers.setValue(checked);
    helpers.setTouched(true);
    onCheckedChange?.(checked);
  };

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {/* Checkbox with Label */}
      <div
        className={cn(
          "flex items-start gap-3",
          checkboxPosition === "right" && "flex-row-reverse justify-end"
        )}
      >
        <Checkbox
          id={checkboxId}
          checked={field.value || false}
          // Use the correct event for ShadCN Checkbox (expects (checked: boolean) => void)
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
          aria-invalid={showError ? "true" : "false"}
          aria-describedby={cn(showError && errorId, helperText && helperId)}
          className={cn(showError && "border-destructive", className)}
          {...checkboxProps}
        />

        {label && (
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor={checkboxId}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                showError && "text-destructive"
              )}
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && !showError && (
        <p
          id={helperId}
          className={cn("text-sm text-muted-foreground", checkboxPosition === "left" && "ml-9")}
        >
          {helperText}
        </p>
      )}

      {/* Error Message */}
      {showError && (
        <p
          id={errorId}
          className={cn(
            "text-sm font-medium text-destructive",
            checkboxPosition === "left" && "ml-9"
          )}
          role="alert"
        >
          {meta.error}
        </p>
      )}
    </div>
  );
};

export default CheckboxWithProps;
