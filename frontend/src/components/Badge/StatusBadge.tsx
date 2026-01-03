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
    bg: "bg-income-100 dark:bg-income-weak",
    text: "text-income-strong",
    border: "border-income",
  },
  completed: {
    bg: "bg-income-100 dark:bg-income-weak",
    text: "text-income-strong",
    border: "border-income",
  },
  success: {
    bg: "bg-income-100 dark:bg-income-weak",
    text: "text-income-strong",
    border: "border-income",
  },
  failed: {
    bg: "bg-expense-100 dark:bg-expense-weak",
    text: "text-expense-strong",
    border: "border-expense",
  },
  income: {
    bg: "bg-income-100 dark:bg-income-weak",
    text: "text-income-strong",
    border: "border-income",
  },
  expense: {
    bg: "bg-expense-100 dark:bg-expense-weak",
    text: "text-expense-strong",
    border: "border-expense",
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
