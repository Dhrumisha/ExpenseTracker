"use client";

import React from "react";
import type { ButtonWithProps as ButtonWithPropsProps } from "../Button/types";
import { Loader } from "../Loader/Loader";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export const ButtonWithProps: React.FC<ButtonWithPropsProps> = ({
  children,
  variant = "default",
  size = "default",
  loading = false,
  loadingText,
  icon,
  iconPosition = "left",
  disabled,
  className,
  ...buttonProps
}) => {
  const isDisabled = disabled || loading;

  // Render icon or loading spinner
  const renderIcon = () => {
    if (loading) {
      return <Loader />;
    }
    return icon;
  };

  // Determine content to display
  const buttonContent = loading && loadingText ? loadingText : children;

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isDisabled}
      className={cn("relative", loading && "cursor-not-allowed", className)}
      aria-busy={loading}
      aria-disabled={isDisabled}
      {...buttonProps}
    >
      {/* Icon/Spinner on left */}
      {(icon || loading) && iconPosition === "left" && (
        <span className={cn("flex items-center", buttonContent && "mr-2")}>{renderIcon()}</span>
      )}

      {/* Button Text */}
      {buttonContent}

      {/* Icon/Spinner on right */}
      {(icon || loading) && iconPosition === "right" && (
        <span className={cn("flex items-center", buttonContent && "ml-2")}>{renderIcon()}</span>
      )}
    </Button>
  );
};

export default ButtonWithProps;
