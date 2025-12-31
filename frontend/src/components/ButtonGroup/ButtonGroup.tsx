// src/components/common/CommonButtonGroup/index.tsx

"use client";

import React from "react";

import { useField } from "formik";

import type { ButtonGroupWithProps as ButtonGroupWithPropsProps } from "@/components/ButtonGroup/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
/**
 * CommonButtonGroup Component
 *
 * A reusable button group component for single or multiple selection
 * Integrates with Formik and preserves ShadCN Button styles
 *
 * @example
 * // Single selection
 * <CommonButtonGroup
 *   name="role"
 *   label="Select Role"
 *   options={[
 *     { label: "Admin", value: "admin" },
 *     { label: "User", value: "user" }
 *   ]}
 * />
 *
 * // Multiple selection
 * <CommonButtonGroup
 *   name="interests"
 *   label="Select Interests"
 *   multiple
 *   options={interestsOptions}
 * />
 */
export const ButtonGroupWithProps: React.FC<ButtonGroupWithPropsProps> = ({
  name,
  label,
  helperText,
  required = false,
  disabled = false,
  containerClassName,
  options,
  multiple = false,
  variant = "outline",
  size = "default",
  orientation = "horizontal",
}) => {
  // Formik integration
  const [field, meta, helpers] = useField(name);

  // Determine if we should show error
  const showError = meta.touched && meta.error;

  // Generate unique IDs
  const groupId = `button-group-${name}`;
  const errorId = `${groupId}-error`;
  const helperId = `${groupId}-helper`;

  // Get current value(s)
  const currentValue = field.value || (multiple ? [] : "");

  // Check if option is selected
  const isSelected = (optionValue: string | number): boolean => {
    if (multiple) {
      return Array.isArray(currentValue) && currentValue.includes(optionValue);
    }
    return currentValue === optionValue;
  };

  // Handle option click
  const handleOptionClick = (optionValue: string | number) => {
    if (disabled) return;

    let newValue;

    if (multiple) {
      // Multiple selection mode
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      if (currentArray.includes(optionValue)) {
        // Remove if already selected
        newValue = currentArray.filter((v) => v !== optionValue);
      } else {
        // Add if not selected
        newValue = [...currentArray, optionValue];
      }
    } else {
      // Single selection mode
      newValue = optionValue;
    }

    helpers.setValue(newValue);
    helpers.setTouched(true);
  };

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {/* Label */}
      {label && (
        <Label className={cn("text-sm font-medium", showError && "text-destructive")}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      {/* Button Group */}
      <div
        id={groupId}
        role="group"
        aria-invalid={showError ? "true" : "false"}
        aria-describedby={cn(showError && errorId, helperText && helperId)}
        className={cn(
          "flex gap-2",
          orientation === "vertical" && "flex-col",
          orientation === "horizontal" && "flex-wrap"
        )}
      >
        {options.map((option) => {
          const selected = isSelected(option.value);
          const isOptionDisabled = disabled || option.disabled;

          return (
            <Button
              key={option.value}
              type="button"
              variant={selected ? "default" : variant}
              size={size}
              disabled={isOptionDisabled}
              onClick={() => handleOptionClick(option.value)}
              className={cn(
                "transition-all",
                selected && "ring-2 ring-primary ring-offset-2",
                showError && !selected && "border-destructive"
              )}
              aria-pressed={selected}
            >
              {option.icon && (
                <span className={cn("flex items-center", option.label && "mr-2")}>
                  {option.icon}
                </span>
              )}
              {option.label}
            </Button>
          );
        })}
      </div>

      {/* Helper Text */}
      {helperText && !showError && (
        <p id={helperId} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}

      {/* Error Message */}
      {showError && (
        <p id={errorId} className="text-sm font-medium text-destructive" role="alert">
          {meta.error}
        </p>
      )}
    </div>
  );
};

export default ButtonGroupWithProps;
