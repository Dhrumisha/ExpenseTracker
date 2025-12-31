"use client";

import React, { useMemo } from "react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimation,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableGridItem } from "@/components/DndGrid/SortableGridItem";
import type { DndGridProps } from "@/components/DndGrid/types";
import Grid from "@/components/Grid/Grid";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

const dropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
};

function DndGrid<T extends Record<string, any>>({
  items,
  setItems,
  renderItem,
  className = "grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 lg:gap-6 lg:px-8 px-4 py-4 lg:py-8",
  sortableKey,
  disableDragAndDrop = false,
}: DndGridProps<T>) {
  const canDragAndDrop = !disableDragAndDrop;

  const [activeId, setActiveId] = React.useState<string | null>(null);

  // Memoize item IDs to prevent unnecessary re-renders
  const itemIds = useMemo(
    () => items.map((item, idx) => `${item[sortableKey]}-${idx}`),
    [items, sortableKey]
  );

  const activeItem = useMemo(() => {
    if (!activeId) return null;
    return items.find((item, idx) => `${item[sortableKey]}-${idx}` === activeId);
  }, [activeId, items, sortableKey]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = React.useCallback(
    (event: DragStartEvent) => {
      if (!canDragAndDrop) return;
      setActiveId(event.active.id as string);
    },
    [canDragAndDrop]
  );

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      if (!canDragAndDrop) return;

      const { active, over } = event;
      setActiveId(null);

      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex(
          (item, idx) => `${item[sortableKey]}-${idx}` === active.id
        );
        const newIndex = items.findIndex((item, idx) => `${item[sortableKey]}-${idx}` === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          // Swap only the two items, don't move others
          const newItems = [...items];
          [newItems[oldIndex], newItems[newIndex]] = [newItems[newIndex], newItems[oldIndex]];
          setItems(newItems);
        }
      }
    },
    [canDragAndDrop, items, setItems, sortableKey]
  );

  const handleDragCancel = React.useCallback(() => {
    setActiveId(null);
  }, []);

  // If user doesn't have permission to drag and drop, render as a regular grid
  if (!canDragAndDrop) {
    return (
      <Grid className={className}>
        {items.map((item, index) => (
          <div key={`${item[sortableKey]}-${index}`}>{renderItem(item, index)}</div>
        ))}
      </Grid>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={itemIds} strategy={rectSortingStrategy}>
        <Grid className={className}>
          {items.map((item, index) => {
            const itemId = `${item[sortableKey]}-${index}`;
            return (
              <SortableGridItem key={itemId} id={itemId}>
                {renderItem(item, index)}
              </SortableGridItem>
            );
          })}
        </Grid>
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimation}>
        {activeId && activeItem ? (
          <div className="opacity-90 shadow-2xl scale-105 rotate-0 transition-all">
            {renderItem(
              activeItem,
              items.findIndex((item, idx) => `${item[sortableKey]}-${idx}` === activeId)
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default DndGrid;
