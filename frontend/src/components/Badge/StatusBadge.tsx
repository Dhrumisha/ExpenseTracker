"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = "Active" | "Inactive" | "Success" | "Failed" | "Income" | "Expense" | string;

export interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const STATUS_CONFIG: Record<
  StatusType,
  { bg: string; text: string; border: string }
> = {
  Active: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-300 dark:border-green-800",
  },
  Inactive: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-300 dark:border-red-800",
  },
  Success: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-300 dark:border-green-800",
  },
  Failed: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-300 dark:border-red-800",
  },
  Income: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-300 dark:border-blue-800",
  },
  Expense: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-300 dark:border-orange-800",
  },
};


const DEFAULT_CONFIG = {
  bgColor: "bg-gray-100",
  textColor: "text-gray-500",
  borderColor: "border-gray-500",
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status] || DEFAULT_CONFIG;

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center justify-center gap-1 min-w-32 h-6 px-2 py-1 rounded-full text-xs text-center font-medium tracking-widest whitespace-nowrap",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
