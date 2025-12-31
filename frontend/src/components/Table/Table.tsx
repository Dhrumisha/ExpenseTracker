"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { ChevronDown, ChevronsUpDown, ChevronRight, ChevronUp } from "lucide-react";

import { Loader } from "@/components/Loader/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DEBOUNCE_DELAY } from "@/utils/constants";
import { debounce } from "@/utils/helpers";

import FilterDialog from "./FilterSheet";
import Pagination from "./Pagination";
import { CheckboxHeader, CheckboxCell } from "./TableCheckbox";
import TableColumnDialog from "./TableColumnDialog";

import type { IReactTableProps, SortingOption } from "./types";
import type {
  ColumnDef,
  VisibilityState,
  SortingState,
  OnChangeFn,
  ExpandedState,
  Row,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";

const ReactTable = <T,>({
  DATA = [],
  COLUMNS = [],
  loading,
  noData = "No records found",
  containerClassName,
  fetchData,
  tableClassName,
  tableBodyClassName,
  headerRowClassName,
  headerCellClassName,
  moreFilterOption,
  bodyCellClassName,
  onApplyFilters,
  bulkActions = [],
  bulkActionPanel,
  // 🔹 Pagination Props
  totalCount = 0,
  pageNumber = 1,
  totalPages = 1,
  pageSize = 10,
  hasPreviousPage = false,
  hasNextPage = false,
  hasPageSize = true,
  displaySearchBar = true,
  displayColumnFilterDialog = true,
  sortingOptions,
  onSortingChange,
  // onSearchChange,
  // search,
  setTablePageSize,
  enableSubRows = false,
  subRowsKey = "children",
  showHeaderExpander = false,
  showDepthIndicators = false,
  depthIndicatorColors,
  searchPlaceholder = "Search ...",
  // filterFieldMappings,
  // rootLevelFilters: initialRootLevelFilters = {},
  searchField,
  isListPage = true, // Used to determine if the table is used inside a list page
  usedInsideModal = false, // Used to determine if the table is used inside a modal
}: IReactTableProps<T>) => {
  const [rowSelection, setRowSelection] = useState({});
  const [internalSearch, setInternalSearch] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, unknown>>({});
  const [openBulkActionDialog, setOpenBulkActionDialog] = useState(false);

  // Convert search to filters based on searchField
  // Search values are added as arrays so buildTablePayload can process them with "contains" operator
  const convertSearchToFilters = useCallback(
    (searchValue: string): Record<string, unknown> => {
      if (!searchValue?.trim() || !searchField) {
        return {};
      }

      const searchFields = Array.isArray(searchField) ? searchField : [searchField];
      const searchFilters: Record<string, unknown> = {};
      const trimmedValue = searchValue.trim();

      // Create filter entries for each search field
      // Use field name as key, and search value as array
      // buildTablePayload will process arrays with "contains" operator if mapping exists
      // If no mapping exists, we still use array format - parent should ensure filterFieldMappings includes search fields
      searchFields.forEach((field) => {
        // Always use array format for search
        // buildTablePayload will check filterFieldMappings for operator
        // If mapping has "contains" operator, it creates separate "contains" filters
        // If no mapping, it defaults to "eq" - parent should add mappings for search fields
        searchFilters[field] = [trimmedValue];
      });

      return searchFilters;
    },
    [searchField]
  );

  // Sorting state - convert from SortingOption to TanStack format
  const [sorting, setSorting] = useState<SortingState>(() => {
    if (sortingOptions?.sortBy) {
      return [
        {
          id: sortingOptions.sortBy,
          desc: sortingOptions.sortOrder === "desc",
        },
      ];
    }
    return [];
  });

  // Debounced search handler - converts search to filters and merges with applied filters
  const debouncedSearchRef = useRef(
    debounce(
      (value: string, currentSorting: SortingState, currentFilters: Record<string, unknown>) => {
        // Convert search to filters
        const searchFilters = convertSearchToFilters(value);

        // Merge search filters with applied filters
        // Search filters take precedence for fields that exist in both
        const mergedFilters = { ...currentFilters, ...searchFilters };

        // Remove search filters if search is empty
        if (!value?.trim()) {
          // Remove search-related filters
          const searchFields = Array.isArray(searchField)
            ? searchField
            : searchField
              ? [searchField]
              : [];
          searchFields.forEach((field) => {
            delete mergedFilters[field];
          });
        }

        // Reset to page 1 and trigger fetchData with merged filters
        if (fetchData) {
          // Convert current sorting to API format
          const apiSort: SortingOption =
            currentSorting.length > 0
              ? {
                  sortBy: currentSorting[0].id,
                  sortOrder: currentSorting[0].desc ? "desc" : "asc",
                }
              : {
                  sortBy: "",
                  sortOrder: "",
                };

          // Use setTimeout to ensure state update is processed first
          setTimeout(() => {
            fetchData(1, pageSize, apiSort, mergedFilters);
          }, 0);
        }
      },
      DEBOUNCE_DELAY
    )
  );

  // Handle search input change - completely internal to Table component
  const handleSearchChange = (value: string) => {
    setInternalSearch(value);
    // Pass current sorting and filters to the debounced handler
    debouncedSearchRef.current(value, sorting, appliedFilters);
  };

  // Checkbox column
  const checkboxColumn = useMemo<ColumnDef<T>>(
    () => ({
      id: "select",
      header: CheckboxHeader as unknown as ColumnDef<T>["header"],
      cell: CheckboxCell as unknown as ColumnDef<T>["cell"],
      enableSorting: false,
      enableHiding: false,
    }),
    []
  );

  const [expanded, setExpanded] = useState<ExpandedState>({});

  const defaultGetSubRows = useCallback(
    (row: T) => {
      if (!enableSubRows) return undefined;
      const children = (row as Record<string, unknown>)[subRowsKey];
      return Array.isArray(children) ? (children as T[]) : undefined;
    },
    [enableSubRows, subRowsKey]
  );

  const getIndicatorColor = useCallback(
    (rowIndex: number, depth: number) => {
      if (!showDepthIndicators) {
        return undefined;
      }

      if (depthIndicatorColors && depthIndicatorColors.length > 0) {
        const paletteIndex = (rowIndex + depth) % depthIndicatorColors.length;
        return depthIndicatorColors[paletteIndex];
      }

      const hue = ((rowIndex + depth) * 53) % 360;
      return `hsl(${hue} 65% 50%)`;
    },
    [depthIndicatorColors, showDepthIndicators]
  );

  const expanderColumn = useMemo<ColumnDef<T>>(
    () => ({
      id: "expander",
      header: ({ table }) => {
        if (!enableSubRows || !showHeaderExpander) {
          return null;
        }

        const hasExpandableRows = table
          .getPreFilteredRowModel()
          .rows.some((row) => row.getCanExpand());

        if (!hasExpandableRows) {
          return null;
        }

        return (
          <button
            type="button"
            className="flex w-full items-center justify-center text-gray-500"
            onClick={() => table.toggleAllRowsExpanded()}
          >
            {table.getIsAllRowsExpanded() ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        );
      },
      cell: ({ row }) => {
        if (!enableSubRows) {
          return null;
        }

        const canExpand = row.getCanExpand();
        const indicatorColor = getIndicatorColor(row.index, row.depth);
        const indent = row.depth > 0 ? `${row.depth * 12}px` : undefined;

        const indicatorSize =
          row.depth === 0 ? "h-3 w-3" : row.depth === 1 ? "h-2.5 w-2.5" : "h-2 w-2";

        return (
          <div className="flex h-5 w-full items-center gap-2" style={{ paddingLeft: indent }}>
            <button
              type="button"
              className="flex h-5 items-center"
              onClick={row.getToggleExpandedHandler()}
              disabled={!canExpand}
            >
              {canExpand ? (
                row.getIsExpanded() ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )
              ) : (
                <span className="inline-block h-4 w-4" />
              )}
            </button>
            {indicatorColor && (
              <span
                className={cn("inline-block rounded-full", indicatorSize)}
                style={{ backgroundColor: indicatorColor }}
              />
            )}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    }),
    [enableSubRows, showHeaderExpander, getIndicatorColor]
  );

  // Sync external sorting prop with internal state
  useEffect(() => {
    if (sortingOptions?.sortBy) {
      setSorting([
        {
          id: sortingOptions.sortBy,
          desc: sortingOptions.sortOrder === "desc",
        },
      ]);
    } else {
      setSorting([]);
    }
  }, [sortingOptions?.sortBy, sortingOptions?.sortOrder]);

  const tanstackSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    const newSorting =
      typeof updaterOrValue === "function"
        ? updaterOrValue(table.getState().sorting) // get updated value from updater
        : updaterOrValue;

    // Update local sorting state so icons update immediately
    setSorting(newSorting);

    // Convert tanstack -> your API format
    const apiSort: SortingOption =
      newSorting.length > 0
        ? {
            sortBy: newSorting[0].id,
            sortOrder: newSorting[0].desc ? "desc" : "asc",
          }
        : {
            sortBy: "",
            sortOrder: "",
          };

    // Notify parent component about sorting change (optional, for backward compatibility)
    onSortingChange?.(apiSort);

    // Convert search to filters and merge with applied filters
    const searchFilters = convertSearchToFilters(internalSearch);
    const mergedFilters = { ...appliedFilters, ...searchFilters };

    // Remove search filters if search is empty
    if (!internalSearch?.trim()) {
      const searchFields = Array.isArray(searchField)
        ? searchField
        : searchField
          ? [searchField]
          : [];
      searchFields.forEach((field) => {
        delete mergedFilters[field];
      });
    }

    // Automatically trigger API call when sorting changes
    // Pass sorting and merged filters directly to fetchData
    // Reset to page 1 and trigger fetchData
    if (fetchData) {
      setTimeout(() => {
        fetchData(1, pageSize, apiSort, mergedFilters);
      }, 0);
    }
  };

  // ✅ Process columns to add sorting capability
  const processedColumns = useMemo<ColumnDef<T>[]>(() => {
    return COLUMNS.map(
      (col) =>
        ({
          ...col,
          // Disable sorting for actions column, enable for others unless explicitly disabled
          enableSorting: col.id === "actions" ? false : col.enableSorting !== false,
        }) as ColumnDef<T>
    );
  }, [COLUMNS]);

  //  Merge columns
  const columns = useMemo<ColumnDef<T>[]>(() => {
    if (enableSubRows) {
      return [checkboxColumn, expanderColumn, ...processedColumns];
    }

    return [checkboxColumn, ...processedColumns];
  }, [checkboxColumn, expanderColumn, processedColumns, enableSubRows]);

  // Initialize column order on mount
  useEffect(() => {
    if (columns.length > 0 && columnOrder.length === 0) {
      setColumnOrder(columns.map((col) => col.id!));
    }
  }, [columns, columnOrder.length]);

  //  Create table instance with sorting
  const table = useReactTable<T>({
    data: DATA,
    columns: columns as ColumnDef<T, any>[],
    state: {
      rowSelection,
      columnVisibility,
      columnOrder,
      sorting, // Add sorting to state
      ...(enableSubRows && { expanded }),
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onSortingChange: tanstackSortingChange, // Add sorting change handler
    ...(enableSubRows && { onExpandedChange: setExpanded }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // Add sorted row model
    ...(enableSubRows && {
      getSubRows: defaultGetSubRows,
      getExpandedRowModel: getExpandedRowModel(),
      getRowCanExpand: (row: Row<T>) => {
        const subRows = defaultGetSubRows(row.original);
        return Array.isArray(subRows) && subRows.length > 0;
      },
    }),
    enableRowSelection: true,
    enableMultiSort: false, // Only allow single column sorting
    manualSorting: true, // Since we're handling sorting server-side
  });

  //  Bulk actions
  const selectedCount = Object.keys(rowSelection).length;
  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);

  //  Column management for dialog
  const userColumns = table
    .getAllLeafColumns()
    .filter((col) => !["select", "actions", "expander"].includes(col.id));

  const allColumns = userColumns.map((col) => ({
    id: col.id,
    header: String(col.columnDef.header || col.id),
  }));

  const visibleColumns = userColumns.filter((col) => col.getIsVisible()).map((col) => col.id);

  //  When dialog "Apply" is clicked
  const handleColumnSave = (visible: string[]) => {
    const newVisibility: VisibilityState = {};
    allColumns.forEach((col) => {
      newVisibility[col.id] = visible.includes(col.id);
    });

    setColumnVisibility(newVisibility);
    const leafColumnIds = table.getAllLeafColumns().map((col) => col.id);
    const baseOrder = ["select"];
    if (enableSubRows && leafColumnIds.includes("expander")) {
      baseOrder.push("expander");
    }
    baseOrder.push(...visible);
    if (leafColumnIds.includes("actions")) {
      baseOrder.push("actions");
    }
    setColumnOrder(baseOrder);
  };

  // Handle filters internally - store and trigger API call
  const handleApplyFilters = (filters: Record<string, unknown>) => {
    // Store filters internally
    setAppliedFilters(filters);

    // Notify parent component about filter change (optional, for backward compatibility)
    if (typeof onApplyFilters === "function") {
      onApplyFilters(filters);
    }

    // Automatically trigger API call when filters are applied
    // Reset to page 1 and trigger fetchData with filters and current sorting
    if (fetchData) {
      // Get current sorting state from table
      const currentSorting = table.getState().sorting;
      const apiSort: SortingOption =
        currentSorting.length > 0
          ? {
              sortBy: currentSorting[0].id,
              sortOrder: currentSorting[0].desc ? "desc" : "asc",
            }
          : {
              sortBy: "",
              sortOrder: "",
            };

      // Convert search to filters and merge with new filters
      const searchFilters = convertSearchToFilters(internalSearch);
      const mergedFilters = { ...filters, ...searchFilters };

      // Remove search filters if search is empty
      if (!internalSearch?.trim()) {
        const searchFields = Array.isArray(searchField)
          ? searchField
          : searchField
            ? [searchField]
            : [];
        searchFields.forEach((field) => {
          delete mergedFilters[field];
        });
      }

      setTimeout(() => {
        fetchData(1, pageSize, apiSort, mergedFilters);
      }, 0);
    }
  };

  //  Render sorting icon
  const renderSortingIcon = (columnId: string, canSort: boolean) => {
    if (!canSort || columnId === "select" || columnId === "actions") {
      return null;
    }

    // Use table's current sorting state to ensure icons update correctly
    const currentSorting = table.getState().sorting;
    const isSorted = currentSorting.length > 0 && currentSorting[0].id === columnId;
    const isDesc = isSorted && currentSorting[0].desc;

    return (
      <button
        className="ml-1 inline-flex items-center"
        onClick={(e) => {
          e.stopPropagation();
          if (!isSorted) {
            // Not sorted - set to ascending
            tanstackSortingChange([{ id: columnId, desc: false }]);
          } else if (!isDesc) {
            // Currently ascending - set to descending
            tanstackSortingChange([{ id: columnId, desc: true }]);
          } else {
            // Currently descending - clear sorting
            tanstackSortingChange([]);
          }
        }}
      >
        {!isSorted && <ChevronsUpDown className="h-4 w-4 text-gray-400 hover:text-gray-600" />}
        {isSorted && !isDesc && <ChevronUp className="h-4 w-4 text-blue-600" />}
        {isSorted && isDesc && <ChevronDown className="h-4 w-4 text-blue-600" />}
      </button>
    );
  };

  return (
    <div
      className={cn(
        `w-full space-y-4 ${
          usedInsideModal
            ? "p-0!"
            : isListPage
              ? "lg:py-8 xl:px-8 py-4 px-8"
              : "lg:py-6 lg:px-6 py-4 px-8"
        }`,
        containerClassName
      )}
    >
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] space-y-4">
          {/* 🔍 Search + Filters + Columns + Bulk Actions in one container */}
          {displayColumnFilterDialog && (
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              {/* 🔍 Search + Filters + Columns */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="flex-1 min-w-[280px] lg:max-w-1/3">
                  {displaySearchBar && (
                    <Input
                      placeholder={searchPlaceholder}
                      value={internalSearch}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full rounded-md border-gray-200 bg-white text-sm focus-visible:ring-0 focus:border-gray-300"
                    />
                  )}
                </div>
                {/* Column + Filters */}
                <div className="flex items-center gap-2">
                  <TableColumnDialog
                    allColumns={allColumns}
                    visibleColumns={visibleColumns}
                    onSave={handleColumnSave}
                  />
                  {moreFilterOption && moreFilterOption.length > 0 && (
                    <FilterDialog filters={moreFilterOption || []} onApply={handleApplyFilters} />
                  )}
                </div>
              </div>
              {/* Divider */}
              {selectedCount > 0 && <div className="my-3 border-t border-gray-200" />}

              {/* Bulk Actions */}
              {selectedCount > 0 && (
                <div className="pt-1">
                  {bulkActionPanel ? (
                    bulkActionPanel(selectedRows, selectedCount)
                  ) : (
                    <div className="flex items-center justify-start gap-2">
                      <span className="text-sm font-medium text-gray-600">
                        {selectedCount} selected
                      </span>
                      <div className="flex gap-2">
                        {bulkActions.map((action, index) =>
                          action?.isOpenBulkActionDialog ? (
                            <>
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => setOpenBulkActionDialog(true)}
                                className="flex items-center gap-1 rounded-md text-sm font-medium"
                              >
                                {action.icon && <span className="mr-1">{action.icon}</span>}
                                {action.label}
                              </Button>
                              <BulkActionDialog
                                openBulkActionDialog={openBulkActionDialog}
                                setOpenBulkActionDialog={setOpenBulkActionDialog}
                                action={action}
                                selectedRows={selectedRows}
                                resetRowSelection={() => table.resetRowSelection()}
                              />
                            </>
                          ) : (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => action.onClick(selectedRows)}
                              className="flex items-center gap-1 rounded-md text-sm font-medium"
                            >
                              {action.icon && <span className="mr-1">{action.icon}</span>}
                              {action.label}
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {/* 🧱Table */}
          <div
            className={cn(
              "w-full overflow-x-auto border border-[#e5e7eb] rounded-[0.75rem]",
              tableClassName
            )}
          >
            <Table className={cn("w-full text-sm", tableClassName)}>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className={cn("bg-[#ffffff] text-gray-800", headerRowClassName)}
                  >
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      return (
                        <TableHead
                          key={header.id}
                          className={cn(
                            "font-bold text-gray-700 text-start py-4 text-md border-b border-[#e5e7eb] last:text-end bg-gray-100",
                            canSort &&
                              header.id !== "select" &&
                              header.id !== "actions" &&
                              "cursor-pointer select-none",
                            headerCellClassName
                          )}
                          onClick={
                            canSort && header.id !== "select" && header.id !== "actions"
                              ? () => {
                                  const columnId = header.column.id;
                                  // Use table's current sorting state
                                  const currentSorting = table.getState().sorting;
                                  const isSorted =
                                    currentSorting.length > 0 && currentSorting[0].id === columnId;
                                  const isDesc = isSorted && currentSorting[0].desc;

                                  if (!isSorted) {
                                    tanstackSortingChange([{ id: columnId, desc: false }]);
                                  } else if (!isDesc) {
                                    tanstackSortingChange([{ id: columnId, desc: true }]);
                                  } else {
                                    tanstackSortingChange([]);
                                  }
                                }
                              : undefined
                          }
                        >
                          {/* // if header is action then justify it to center */}
                          <div
                            className={cn(
                              "flex items-center",
                              header.id === "actions" ? "justify-center" : "justify-start"
                            )}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                            {renderSortingIcon(header.id, canSort)}
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody className={cn(tableBodyClassName)}>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : DATA.length > 0 ? (
                  table.getRowModel().rows.map((row) => {
                    return (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={cn(
                          "text-start hover:bg-[#f9fafb] bg-[#ffffff]",
                          row.getIsSelected() && "bg-[#f3f4f6]"
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={cn("py-3 border-b border-[#f3f4f6]", bodyCellClassName)}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                      {noData}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        totalCount={totalCount}
        pageNumber={pageNumber}
        totalPages={totalPages}
        pageSize={pageSize}
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        hasPageSize={hasPageSize}
        setTablePageSize={setTablePageSize}
        fetchData={fetchData}
      />
    </div>
  );
};

export default ReactTable;

const BulkActionDialog = ({
  openBulkActionDialog,
  setOpenBulkActionDialog,
  action,
  selectedRows,
  resetRowSelection,
}: any) => {
  return (
    <Dialog open={openBulkActionDialog} onOpenChange={() => setOpenBulkActionDialog(false)}>
      <DialogContent className="max-w-full sm:max-w-md lg:max-w-lg xl:max-w-xl p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle>{action.title}</DialogTitle>
          <DialogDescription>{action.description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpenBulkActionDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              action.onClick(selectedRows);
              setOpenBulkActionDialog(false);
              resetRowSelection();
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
