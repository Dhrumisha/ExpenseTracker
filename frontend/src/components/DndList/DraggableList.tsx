// DraggableList.tsx
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import type { PointerEvent } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import React, { useState } from "react";

export interface DraggableListProps<T> {
  items: T[];
  getId: (item: T) => string; // unique id extractor
  renderItem: (item: T) => React.ReactNode;
  onChange: (items: T[]) => void; // returns reordered list
}

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

// Check if the event target should prevent drag activation
// This prevents drag when interacting with form elements or elements inside modals/dialogs
function shouldHandleEvent(element: HTMLElement | null): boolean {
  if (!element) return true;

  // Interactive elements that should not trigger drag
  const interactiveElements = [
    "input",
    "textarea",
    "select",
    "button",
    "a",
    "label",
  ];

  // Check if the element or any of its ancestors should prevent drag
  let currentElement: HTMLElement | null = element;

  while (currentElement) {
    const tagName = currentElement.tagName.toLowerCase();

    // Check for interactive elements
    if (interactiveElements.includes(tagName)) {
      return false;
    }

    // Check for contentEditable
    if (currentElement.isContentEditable) {
      return false;
    }

    // Check for elements with role="dialog" or inside a dialog/modal
    if (
      currentElement.getAttribute("role") === "dialog" ||
      currentElement.getAttribute("role") === "alertdialog" ||
      currentElement.hasAttribute("data-radix-portal") ||
      currentElement.classList.contains("modal") ||
      currentElement.classList.contains("dialog")
    ) {
      return false;
    }

    // Check for data attribute to explicitly disable drag
    if (currentElement.dataset.noDrag === "true") {
      return false;
    }

    currentElement = currentElement.parentElement;
  }

  return true;
}

// Custom PointerSensor that ignores interactive elements and modals
class SmartPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: (
        { nativeEvent: event }: PointerEvent,
        { onActivation }: { onActivation?: (event: { event: Event }) => void }
      ) => {
        if (
          !event.isPrimary ||
          event.button !== 0 ||
          !shouldHandleEvent(event.target as HTMLElement)
        ) {
          return false;
        }

        onActivation?.({ event });
        return true;
      },
    },
  ];
}

export function DraggableList<T>({
  items,
  getId,
  renderItem,
  onChange,
}: DraggableListProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useSensor(SmartPointerSensor as any, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  );

  const activeItem = items.find((item) => getId(item) === activeId);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => getId(i) === active.id);
    const newIndex = items.findIndex((i) => getId(i) === over.id);

    // Swap only the two items, don't move others
    const newItems = [...items];
    [newItems[oldIndex], newItems[newIndex]] = [newItems[newIndex], newItems[oldIndex]];
    
    onChange(newItems);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={items.map(getId)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <SortableItem key={getId(item)} id={getId(item)}>
            {renderItem(item)}
          </SortableItem>
        ))}
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeId && activeItem ? (
          <div className="opacity-90 shadow-2xl scale-105 rotate-0 transition-all">
            {renderItem(activeItem)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
