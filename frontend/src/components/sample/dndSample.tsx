"use client";

import React, { useState } from "react";

import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { DragEndEvent, DragStartEvent, DragOverEvent } from "@dnd-kit/core";

// Types
interface Task {
  id: string;
  title: string;
  columnId: string;
}

interface DndColumn {
  id: string;
  title: string;
  visible: boolean;
}

// Sortable Item Component (Task Card)
function SortableItem({ id, title }: { id: string; title: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-center gap-3 p-3 mb-2 bg-white border border-gray-200 rounded-lg cursor-move hover:shadow-md transition-all duration-200",
        isDragging && "shadow-xl ring-2 ring-blue-400 scale-105"
      )}
    >
      <GripVertical className="h-5 w-5 text-gray-400" />
      <span className="text-sm font-medium text-gray-700">{title}</span>
    </div>
  );
}

// Sortable Column Editor Item
function SortableColumnItem({
  id,
  title,
  visible,
  onToggle,
}: {
  id: string;
  title: string;
  visible: boolean;
  onToggle: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 250ms ease",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 mb-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200",
        isDragging && "shadow-xl ring-2 ring-blue-400 scale-105 z-50"
      )}
    >
      <div {...attributes} {...listeners} className="cursor-move">
        <GripVertical className="h-5 w-5 text-gray-400 hover:text-gray-600" />
      </div>
      <input
        type="checkbox"
        checked={visible}
        onChange={() => onToggle(id)}
        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
      />
      <span className="text-sm font-medium text-gray-700 flex-grow">{title}</span>
    </div>
  );
}

// Droppable Column Component
function DroppableColumn({
  id,
  title,
  children,
  count,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  count: number;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="shrink-0 w-80">
      <Card
        ref={setNodeRef}
        className={cn(
          "bg-white p-4 transition-all duration-200",
          isOver && "ring-2 ring-blue-400 bg-blue-50"
        )}
      >
        <h3 className="font-semibold text-lg mb-4 text-gray-800 flex items-center justify-between">
          {title}
          <span className="text-sm font-normal text-gray-500">{count}</span>
        </h3>
        <div className="min-h-[200px] space-y-2">{children}</div>
      </Card>
    </div>
  );
}

// Main DndSample Demo Component
export default function DndDemo() {
  const [showColumnEditor, setShowColumnEditor] = useState(false);

  // DndColumns state
  const [dndColumns, setDndColumns] = useState<DndColumn[]>([
    { id: "todo", title: "To Do", visible: true },
    { id: "progress", title: "In Progress", visible: true },
    { id: "done", title: "Done", visible: true },
  ]);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([
    { id: "task-1", title: "Design landing page", columnId: "todo" },
    { id: "task-2", title: "Implement authentication", columnId: "todo" },
    { id: "task-3", title: "Set up database", columnId: "todo" },
    { id: "task-4", title: "Develop API endpoints", columnId: "progress" },
    { id: "task-5", title: "Write unit tests", columnId: "progress" },
    { id: "task-6", title: "Project setup", columnId: "done" },
    { id: "task-7", title: "Code review", columnId: "done" },
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"task" | "column">("task");
  const [overColumnId, setOverColumnId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // Column editor handlers
  const handleColumnDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setActiveType("column");
  };

  const handleColumnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      setDndColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleToggleColumn = (id: string) => {
    setDndColumns((cols) =>
      cols.map((col) => (col.id === id ? { ...col, visible: !col.visible } : col))
    );
  };

  // Task handlers
  const handleTaskDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setActiveType("task");
  };

  const handleTaskDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setOverColumnId(null);
      return;
    }

    const overId = over.id as string;
    // Check if hovering over a column
    const isColumn = dndColumns.some((col) => col.id === overId);
    if (isColumn) {
      setOverColumnId(overId);
    } else {
      // Hovering over a task - find its column
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        setOverColumnId(overTask.columnId);
      }
    }
  };

  const handleTaskDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverColumnId(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;

    // Check if dropped on a column directly
    const isColumn = dndColumns.some((col) => col.id === overId);
    if (isColumn) {
      // Move to the end of the target column
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === active.id ? { ...task, columnId: overId } : task))
      );
    } else {
      // Dropped on another task
      const overTask = tasks.find((t) => t.id === overId);

      if (overTask) {
        if (activeTask.columnId === overTask.columnId) {
          // Reorder within the same column
          const columnTasks = tasks.filter((t) => t.columnId === activeTask.columnId);
          const oldIndex = columnTasks.findIndex((t) => t.id === active.id);
          const newIndex = columnTasks.findIndex((t) => t.id === overId);
          const reorderedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);

          // Update the tasks array with new order
          setTasks((prevTasks) => {
            const otherTasks = prevTasks.filter((t) => t.columnId !== activeTask.columnId);
            return [...otherTasks, ...reorderedColumnTasks];
          });
        } else {
          // Move to different column at the position of the over task
          const targetColumnTasks = tasks.filter((t) => t.columnId === overTask.columnId);
          const insertIndex = targetColumnTasks.findIndex((t) => t.id === overId);

          setTasks((prevTasks) => {
            // Remove from old position
            const withoutActive = prevTasks.filter((t) => t.id !== active.id);
            const updatedTask = { ...activeTask, columnId: overTask.columnId };

            // Insert at new position
            const otherColumnTasks = withoutActive.filter((t) => t.columnId !== overTask.columnId);
            const targetTasks = withoutActive.filter((t) => t.columnId === overTask.columnId);
            targetTasks.splice(insertIndex, 0, updatedTask);

            return [...otherColumnTasks, ...targetTasks];
          });
        }
      }
    }
  };

  const getTasksByColumn = (columnId: string) => tasks.filter((task) => task.columnId === columnId);

  const activeTask = tasks.find((t) => t.id === activeId);
  const activeColumn = dndColumns.find((c) => c.id === activeId);

  // Get visible columns
  const visibleColumns = dndColumns.filter((col) => col.visible);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Drag & Drop Demo</h1>
          <Button onClick={() => setShowColumnEditor(true)} variant="outline">
            Edit Columns
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleTaskDragStart}
          onDragOver={handleTaskDragOver}
          onDragEnd={handleTaskDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-4">
            {visibleColumns.map((column) => (
              <DroppableColumn
                key={column.id}
                id={column.id}
                title={column.title}
                count={getTasksByColumn(column.id).length}
              >
                <SortableContext
                  items={getTasksByColumn(column.id).map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {getTasksByColumn(column.id).map((task) => (
                    <SortableItem key={task.id} id={task.id} title={task.title} />
                  ))}
                  {getTasksByColumn(column.id).length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-8">Drop tasks here</div>
                  )}
                </SortableContext>
              </DroppableColumn>
            ))}
          </div>

          <DragOverlay>
            {activeId && activeType === "task" && activeTask ? (
              <div className="p-3 bg-white border-2 border-blue-400 rounded-lg shadow-xl">
                <span className="text-sm font-medium">{activeTask.title}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Column Editor Modal */}
        {showColumnEditor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md bg-white p-6 relative">
              <button
                onClick={() => setShowColumnEditor(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-bold text-gray-900 mb-2">Edit Columns</h2>
              <p className="text-sm text-gray-600 mb-6">
                Drag and drop to reorder columns. Check/uncheck to show/hide columns.
              </p>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleColumnDragStart}
                onDragEnd={handleColumnDragEnd}
              >
                <SortableContext
                  items={dndColumns.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="max-h-[400px] overflow-y-auto mb-6 space-y-1">
                    {dndColumns.map((column) => (
                      <SortableColumnItem
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        visible={column.visible}
                        onToggle={handleToggleColumn}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {activeId && activeType === "column" && activeColumn ? (
                    <div className="flex items-center gap-3 p-3 bg-white border-2 border-blue-400 rounded-lg shadow-xl">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                      <input
                        type="checkbox"
                        checked={activeColumn.visible}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">{activeColumn.title}</span>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowColumnEditor(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-black text-white hover:bg-gray-800"
                  onClick={() => setShowColumnEditor(false)}
                >
                  Apply
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
