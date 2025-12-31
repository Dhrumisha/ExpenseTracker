"use client";

import * as React from "react";

import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type { ITooltipProps } from "./types";

export const TooltipWithProps: React.FC<ITooltipProps> = ({
  content,
  asChild = false,
  contentClassName,
  sideOffset = 4,
  children,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent sideOffset={sideOffset} className={cn(contentClassName)}>
          {typeof content === "string" ? <p>{content}</p> : content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
