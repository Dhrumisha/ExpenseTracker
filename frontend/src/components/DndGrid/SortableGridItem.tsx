"use client";

import React from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { SortableItemProps } from "@/components/DndGrid/types";
import { cn } from "@/lib/utils";

export const SortableGridItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Prevent dragging when interacting with form elements
  const modifiedListeners = React.useMemo(() => {
    if (!listeners) return undefined;

    return {
      ...listeners,
      onPointerDown: (e: React.PointerEvent) => {
        const target = e.target as Element;

        // Don't initiate drag if clicking on interactive elements
        if (
          target.tagName.toLowerCase() === "input" ||
          target.tagName.toLowerCase() === "button" ||
          target.tagName.toLowerCase() === "select" ||
          target.tagName.toLowerCase() === "textarea" ||
          target.closest("button") ||
          target.closest("input") ||
          target.closest("select") ||
          target.closest("textarea")
        ) {
          return;
        }

        listeners?.onPointerDown?.(e);
      },
    };
  }, [listeners]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...modifiedListeners}
      className={cn(
        "transform-gpu transition-all duration-200 ease-in-out",
        isDragging && "opacity-40 scale-95 z-50",
        isOver && "ring-2 ring-blue-400 ring-offset-2 scale-102",
        !isDragging && !isOver && "hover:shadow-md"
      )}
    >
      {children}
    </div>
  );
};
