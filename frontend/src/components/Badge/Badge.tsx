// src/components/common/CommonBadge/index.tsx

"use client";

import React from "react";

import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * CommonBadge Props
 */
export interface BadgeWithProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "info"
    | "active"
    | "inactive"
    | "drafted"
    | "pending";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
  dot?: boolean;
  dotColor?: string;
  count?: number;
  maxCount?: number;
}

/**
 * CommonBadge Component
 *
 * A reusable badge component that wraps ShadCN Badge
 * Supports multiple variants, sizes, icons, and removable functionality
 *
 * @example
 * // Basic usage
 * <CommonBadge>New</CommonBadge>
 *
 * @example
 * // With icon
 * <CommonBadge
 *   variant="success"
 *   icon={<Check />}
 *   iconPosition="left"
 * >
 *   Completed
 * </CommonBadge>
 *
 * @example
 * // Removable badge
 * <CommonBadge
 *   removable
 *   onRemove={() => console.log("removed")}
 * >
 *   React
 * </CommonBadge>
 */
export const CommonBadge: React.FC<BadgeWithProps> = ({
  children,
  variant = "default",
  size = "md",
  rounded = false,
  icon,
  iconPosition = "left",
  removable = false,
  onRemove,
  onClick,
  className,
  dot = false,
  dotColor,
  count,
  maxCount = 99,
}) => {
  // Size classes
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-2.5 py-0.5 gap-1.5",
    lg: "text-base px-3 py-1 gap-2",
  };

  // Icon sizes
  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  // Additional variant classes
  const variantClasses = {
    success:
      "bg-success/10 text-success border-success/20 inline-flex items-center gap-1 hover:bg-success/10 hover:text-success",
    warning:
      "bg-warning/10 text-warning border-warning/20 inline-flex items-center gap-1 hover:bg-warning/10 hover:text-warning",
    info: "bg-blue-500/10 text-blue-700 border-blue-500/20 inline-flex items-center gap-1 hover:bg-blue-500/10 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-400",
    active:
      "bg-success/10 text-success border-success/20 inline-flex items-center gap-1 hover:bg-success/10 hover:text-success",
    inactive:
      "bg-destructive/10 text-destructive border-destructive/20 inline-flex items-center gap-1 hover:bg-destructive/10 hover:text-destructive",
    drafted:
      "bg-gray-500/10 text-gray-700 border-gray-500/20 inline-flex items-center gap-1 hover:bg-gray-500/10 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-400",
    pending:
      "bg-yellow-500/10 text-yellow-700 border-yellow-500/20 inline-flex items-center gap-1 hover:bg-yellow-500/10 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-400",
  };

  // Get variant class if custom variant
  const getVariantClass = () => {
    if (
      variant === "success" ||
      variant === "warning" ||
      variant === "info" ||
      variant === "active" ||
      variant === "inactive" ||
      variant === "drafted" ||
      variant === "pending"
    ) {
      return variantClasses[variant];
    }
    return "";
  };

  // Display count with max
  const displayCount = count !== undefined ? (count > maxCount ? `${maxCount}+` : count) : null;

  return (
    <Badge
      variant={
        variant === "success" ||
        variant === "warning" ||
        variant === "info" ||
        variant === "active" ||
        variant === "inactive" ||
        variant === "drafted" ||
        variant === "pending"
          ? "secondary"
          : variant
      }
      className={cn(
        "inline-flex items-center font-medium",
        sizeClasses[size],
        rounded && "rounded-full",
        getVariantClass(),
        (onClick || removable) && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={onClick}
    >
      {/* Dot indicator */}
      {dot && <span className={cn("h-2 w-2 rounded-full", dotColor || "bg-current")} />}

      {/* Left icon */}
      {icon && iconPosition === "left" && (
        <span className={cn("flex-shrink-0", iconSizes[size])}>{icon}</span>
      )}

      {/* Content */}
      <span className="flex-1">{displayCount !== null ? displayCount : children}</span>

      {/* Right icon */}
      {icon && iconPosition === "right" && (
        <span className={cn("flex-shrink-0", iconSizes[size])}>{icon}</span>
      )}

      {/* Remove button */}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className={cn(
            "flex-shrink-0 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors",
            iconSizes[size]
          )}
          aria-label="Remove"
        >
          <X className="h-full w-full" />
        </button>
      )}
    </Badge>
  );
};

/**
 * CommonBadgeGroup Component
 *
 * Displays multiple badges in a group
 */
export interface BadgeGroupWithProps {
  badges: Array<{
    id: string;
    label: string;
    variant?: BadgeWithProps["variant"];
    icon?: React.ReactNode;
    removable?: boolean;
  }>;
  size?: BadgeWithProps["size"];
  className?: string;
  onRemove?: (id: string) => void;
}

export const CommonBadgeGroup: React.FC<BadgeGroupWithProps> = ({
  badges,
  size = "md",
  className,
  onRemove,
}) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {badges.map((badge) => (
        <CommonBadge
          key={badge.id}
          variant={badge.variant}
          size={size}
          icon={badge.icon}
          removable={badge.removable}
          onRemove={() => onRemove?.(badge.id)}
        >
          {badge.label}
        </CommonBadge>
      ))}
    </div>
  );
};

export default CommonBadge;
