"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { IPaginationProps } from "./types";

const Pagination: React.FC<IPaginationProps> = ({
  pageNumber = 1,
  totalPages = 1,
  pageSize = 10,
  totalCount = 0,
  setTablePageSize,
  hasPreviousPage = false,
  hasNextPage = false,
  fetchData,
  hasPageSize = true,
}) => {
  const handlePageChange = (newPage: number) => {
    // Pagination changes don't need sorting/filters - just page number
    // fetchData will use current sorting/filters from parent state
    if (fetchData) fetchData(newPage, pageSize);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    // Calculate new total pages based on the new page size
    const newTotalPages = Math.ceil(totalCount / newPageSize) || 1;

    // If current page exceeds the new total pages, reset to page 1
    const newPage = pageNumber > newTotalPages ? 1 : pageNumber;

    // If fetchData is available, use it to update both page and size
    // Page size changes don't need sorting/filters - fetchData will use current state
    // Otherwise, use setTablePageSize for backward compatibility
    if (fetchData) {
      fetchData(newPage, newPageSize);
    } else if (setTablePageSize) {
      setTablePageSize(newPageSize);
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row items-center justify-between pt-4 mt-4 text-sm">
      {/* Left: Items per page */}
      {hasPageSize ? (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Items per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div />
      )}

      {/* Right: Pagination controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPreviousPage}
          onClick={() => handlePageChange(pageNumber - 1)}
        >
          Previous
        </Button>

        <span className="text-muted-foreground">
          Page {pageNumber} of {totalPages || 1}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={!hasNextPage}
          onClick={() => handlePageChange(pageNumber + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
