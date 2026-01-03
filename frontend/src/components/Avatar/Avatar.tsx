"use client";

import React from "react";

import { User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/**
 * CommonAvatar Props
 */
export interface AvatarWithProps {
  src?: string;
  alt?: string;
  fallback?: string | React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  shape?: "circle" | "square";
  className?: string;
  fallbackClassName?: string;
  status?: "online" | "offline" | "away" | "busy";
  showStatus?: boolean;
  onClick?: () => void;
  bordered?: boolean;
  loading?: "lazy" | "eager";
}

/**
 * CommonAvatar Component
 *
 * A reusable avatar component that wraps ShadCN Avatar
 * Supports different sizes, shapes, and status indicators
 *
 * @example
 * // Basic usage
 * <CommonAvatar
 *   src="/user.jpg"
 *   alt="John Doe"
 *   fallback="JD"
 * />
 *
 * @example
 * // With status indicator
 * <CommonAvatar
 *   src="/user.jpg"
 *   fallback="JD"
 *   size="lg"
 *   status="online"
 *   showStatus
 * />
 */
export const CommonAvatar: React.FC<AvatarWithProps> = ({
  src,
  alt = "Avatar",
  fallback,
  size = "md",
  shape = "circle",
  className,
  fallbackClassName,
  status,
  showStatus = false,
  onClick,
  bordered = false,
  loading = "lazy",
}) => {
  // Size classes
  const sizeClasses = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
    "2xl": "h-20 w-20 text-2xl",
  };

  // Status indicator sizes
  const statusSizes = {
    xs: "h-1.5 w-1.5",
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
    xl: "h-3.5 w-3.5",
    "2xl": "h-4 w-4",
  };

  // Status colors
  const statusColors = {
    online: "bg-income",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-expense",
  }; 

  // Generate initials from fallback string
  const getInitials = (fallback: string | React.ReactNode): string => {
    if (typeof fallback !== "string") return "";

    const parts = fallback.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fallback.substring(0, 2).toUpperCase();
  };

  const fallbackContent = typeof fallback === "string" ? getInitials(fallback) : fallback;

  return (
    <div className="relative inline-block">
      <Avatar
        className={cn(
          sizeClasses[size],
          shape === "square" && "rounded-md",
          bordered && "ring-2 ring-border ring-offset-2 ring-offset-background",
          onClick && "cursor-pointer hover:opacity-80 transition-opacity",
          className
        )}
        onClick={onClick}
      >
        <AvatarImage src={src} alt={alt} loading={loading} />
        <AvatarFallback className={cn("bg-muted", fallbackClassName)}>
          {fallbackContent || <User className="h-1/2 w-1/2" />}
        </AvatarFallback>
      </Avatar>

      {/* Status Indicator */}
      {showStatus && status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-background",
            statusSizes[size],
            statusColors[status]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

/**
 * CommonAvatarGroup Component
 *
 * Displays multiple avatars in a group with overlap
 */
export interface AvatarGroupWithProps {
  avatars: Array<{
    src?: string;
    alt?: string;
    fallback?: string;
  }>;
  max?: number;
  size?: AvatarWithProps["size"];
  className?: string;
  onMoreClick?: () => void;
}

export const CommonAvatarGroup: React.FC<AvatarGroupWithProps> = ({
  avatars,
  max = 5,
  size = "md",
  className,
  onMoreClick,
}) => {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {displayAvatars.map((avatar, index) => (
        <CommonAvatar key={index} {...avatar} size={size} bordered className="hover:z-10" />
      ))}

      {remainingCount > 0 && (
        <CommonAvatar
          fallback={`+${remainingCount}`}
          size={size}
          bordered
          className="hover:z-10 cursor-pointer"
          onClick={onMoreClick}
        />
      )}
    </div>
  );
};

export default CommonAvatar;
