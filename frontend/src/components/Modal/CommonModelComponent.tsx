"use client";

import type { ReactNode } from "react";
import React from "react";

import { Loader } from "@/components/Loader/Loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type SizeVariant =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl";

interface CommonModelComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: ReactNode;
  title?: string;
  description?: string;
  footer?: ReactNode;
  size?: SizeVariant;
  className?: string;
  contentClassName?: string;
  isLoading?: boolean;
}

const sizeMap: Record<SizeVariant, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  "8xl": "max-w-8xl",
  "9xl": "max-w-9xl",
};

const CommonModelComponent: React.FC<CommonModelComponentProps> = ({
  open,
  onOpenChange,
  content,
  title,
  description,
  footer,
  size = "xl",
  className,
  contentClassName,
  isLoading = false,
}) => {
  const sizeClass = sizeMap[size];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("w-full flex flex-col max-h-400 overflow-hidden", sizeClass, className)}
      >
        {(title || description) && (
          <DialogHeader className="border-b pb-4 shrink-0">
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        <div
          className={cn(
            "flex-1 overflow-y-auto min-h-0 px-2",
            title || description ? "" : "pt-0 pb-4",
            contentClassName
          )}
        >
          <div className={isLoading ? "opacity-20" : ""}>{content}</div>
          {isLoading && <Loader className="absolute inset-0 bg-transparent" />}
        </div>

        {footer && (
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 border-t pt-4 shrink-0">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CommonModelComponent;
