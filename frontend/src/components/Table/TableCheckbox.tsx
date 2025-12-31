"use client";
import React from "react";

import { Checkbox } from "@/components/ui/checkbox";

import type { HeaderContext, CellContext } from "@tanstack/react-table";

export const CheckboxHeader = ({ table }: HeaderContext<unknown, unknown>) => {
  return (
    <div className="flex items-center justify-center pl-3">
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </div>
  );
};

export const CheckboxCell = ({ row }: CellContext<unknown, unknown>) => {
  return (
    <div className="flex items-start justify-start pl-3">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    </div>
  );
};
