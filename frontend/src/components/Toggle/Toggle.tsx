"use client";

import * as React from "react";

import { Toggle } from "@/components/ui/toggle";

import type { ToggleHelperProps } from "./types";

export const ToggleWithProps = ({
  children,
  pressed,
  onPressedChange,
  className,
  variant = "default",
  size = "default",
  disabled = false,
  ...props
}: ToggleHelperProps) => {
  const [internalPressed, setInternalPressed] = React.useState(false);

  const isPressed = pressed !== undefined ? pressed : internalPressed;

  const handlePressedChange = (newPressed: boolean) => {
    if (pressed === undefined) {
      setInternalPressed(newPressed);
    }
    onPressedChange?.(newPressed);
  };

  return (
    <Toggle
      pressed={isPressed}
      onPressedChange={handlePressedChange}
      variant={variant}
      size={size}
      className={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </Toggle>
  );
};

export default ToggleWithProps;
