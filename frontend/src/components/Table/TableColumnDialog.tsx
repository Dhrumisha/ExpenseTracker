"use client";

import React from "react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Label } from "@radix-ui/react-label";
import { Columns2, GripVertical } from "lucide-react";

import { SortableItem } from "@/components/DndList/SortableItem";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { ScrollArea } from "../ui/scroll-area";

interface IColumnVisibilityDialogProps {
  allColumns: { id: string; header: string }[];
  visibleColumns: string[];
  onSave: (visible: string[]) => void;
}

export default function TableColumnDialog({
  allColumns,
  visibleColumns,
  onSave,
}: IColumnVisibilityDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [columns, setColumns] = React.useState(
    allColumns.map((c) => ({
      id: c.id,
      label: c.header,
      visible: visibleColumns.includes(c.id),
    }))
  );

  // Sync tempVisible when dialog opens
  React.useEffect(() => {
    if (open) {
      setColumns(
        allColumns.map((c) => ({
          id: c.id,
          label: c.header,
          visible: visibleColumns.includes(c.id),
        }))
      );
      setSearchQuery("");
    }
  }, [open, allColumns, visibleColumns]);

  const toggleColumn = (id: string) => {
    setColumns((cols) =>
      cols.map((col) => (col.id === id ? { ...col, visible: !col.visible } : col))
    );
  };

  const handleSave = () => {
    const visible = columns.filter((c) => c.visible).map((c) => c.id);
    onSave(visible);
    setOpen(false);
  };

  const handleCancel = () => {
    setColumns(
      allColumns.map((c) => ({
        id: c.id,
        label: c.header,
        visible: visibleColumns.includes(c.id),
      }))
    );
    setSearchQuery("");
    setOpen(false);
  };

  const filteredColumns = columns.filter((col) =>
    col.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visible = columns.filter((c) => c.visible);

  // --- DnD Kit Setup ---
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = visible.findIndex((c) => c.id === active.id);
    const newIndex = visible.findIndex((c) => c.id === over.id);
    const reorderedVisible = arrayMove(visible, oldIndex, newIndex);

    // Update global column order but preserve invisible ones
    const reorderedIds = reorderedVisible.map((c) => c.id);
    const newCols = [...reorderedVisible, ...columns.filter((c) => !c.visible)].map((c) => ({
      ...c,
      visible: reorderedIds.includes(c.id),
    }));

    setColumns(newCols);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-[0.375rem]">
          <Columns2 className="h-4 w-4" />
          Columns
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg leading-none font-semibold">Edit Columns</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Select and reorder columns to customize your table view
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Left side - Checkbox list */}
          {/* Left: Checkbox list */}
          <div className="space-y-4">
            <Input
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
              placeholder="Search columns"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <ScrollArea className="h-100 pr-4">
              <div className="space-y-3">
                {filteredColumns.map((column) => (
                  <div key={column.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={column.id}
                      checked={column.visible}
                      onCheckedChange={() => toggleColumn(column.id)}
                    />
                    <Label
                      htmlFor={column.id}
                      className={`text-sm font-medium cursor-pointer ${
                        column.visible ? "text-primary" : "text-foreground opacity-70"
                      }`}
                    >
                      {column.label}
                    </Label>
                  </div>
                ))}
                {filteredColumns.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">No columns found</p>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right: DnD visible list */}
          <div>
            <ScrollArea className="h-100">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={visible.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {visible.map((col) => (
                      <SortableItem
                        key={col.id}
                        id={col.id}
                        children={
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{col.label}</span>
                          </div>
                        }
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={visible.length === 0}>
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
