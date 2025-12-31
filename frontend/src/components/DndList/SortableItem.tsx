// SortableItem.tsx
import React from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";

export function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "transition-all duration-200 ease-in-out",
        isDragging && "opacity-40 scale-95 z-50",
        isOver && "ring-2 ring-gray-400 ring-offset-2 scale-102",
        !isDragging && !isOver && "hover:shadow-md hover:rounded-lg"
      )}
    >
      {children}
    </div>
  );
}
