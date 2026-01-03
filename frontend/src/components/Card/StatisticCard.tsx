"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { StatisticCardProps } from "@/types/cards.types";

export const StatisticCard: React.FC<StatisticCardProps> = ({
  items,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border bg-surface p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            {/* Left Content */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {item.title}
              </p>

              <h2 className="text-2xl font-semibold">
                ₹{item.amount}
              </h2>

              {item.description && (
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}

              {item.label && (
                <span
                  className={cn(
                    "inline-block text-xs px-2 py-0.5 rounded-md mt-2",
                    item.trend === "up"
                      ? "text-income bg-income-100 dark:bg-income-weak"
                      : "text-expense bg-expense-100 dark:bg-expense-weak"
                  )}
                >
                  {item.label}
                </span>
              )}
            </div>

            {/* Right Icon */}
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full",
                item.iconBgColor
              )}
            >
              <item.icon className={cn("w-6 h-6", item.iconColor)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticCard;
