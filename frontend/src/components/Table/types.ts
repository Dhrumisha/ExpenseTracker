import type { ReactNode } from "react";

import type { CellContext, HeaderContext } from "@tanstack/react-table";

export interface ITableColumn<T = unknown> {
  id: string;
  accessorKey: string;
  header?: ((props: HeaderContext<T, unknown>) => ReactNode) | string;
  cell?: (props: CellContext<T, unknown>) => ReactNode;
  enableSorting?: boolean;
  hideColumn?: boolean;
}
export interface SortingOption {
  sortBy: string;
  sortOrder: "asc" | "desc" | "";
}

export interface ITableBulkAction<T = unknown> {
  label: string;
  title?: string;
  description?: string;
  icon?: ReactNode;
  onClick: (selectedRows: T[]) => void;
  isOpenBulkActionDialog?: boolean;
}

export interface IReactTableProps<T = unknown> {
  COLUMNS: ITableColumn<T>[];
  DATA: T[];
  fetchData?: (
    page?: number,
    size?: number,
    sorting?: SortingOption,
    filters?: Record<string, unknown>
  ) => Promise<void> | void;
  loading?: boolean;
  noData?: string;
  containerClassName?: string;
  tableClassName?: string;
  tableBodyClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  bodyRowClassName?: string | ((row: T) => string);
  bodyCellClassName?: string;
  moreFilterOption?: IFilteringOption[];
  setTablePageSize?: (size: number) => void;
  totalPages?: number;
  pageNumber?: number;
  pageSize?: number;
  totalCount?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  hasPageSize?: boolean;
  bulkActions?: ITableBulkAction<T>[];
  bulkActionPanel?: (selectedRows: T[], selectedCount: number) => ReactNode;
  onApplyFilters?: (filters: Record<string, unknown>) => void;
  displaySearchBar?: boolean;
  displayColumnFilterDialog?: boolean;
  onSearchChange?: (search: string) => void;
  search?: string;
  sortingOptions?: SortingOption;
  onSortingChange?: (sorting: SortingOption) => void;
  enableSubRows?: boolean;
  subRowsKey?: string;
  showHeaderExpander?: boolean;
  showDepthIndicators?: boolean;
  depthIndicatorColors?: string[];
  searchPlaceholder?: string;
  filterFieldMappings?: Record<string, IFilterFieldMapping>; // Map filter keys to field/operator config
  rootLevelFilters?: Record<string, boolean | string | number>; // Root level filters (like is_active)
  searchField?: string | string[]; // Field(s) to search in - used to convert search to filters
  usedInsideModal?: boolean; // Used to determine if the table is used inside a modal
  isListPage?: boolean; // Used to determine if the table is used inside a list page
}

export interface IFilterOption {
  field: string;
  operator: "equals" | "contains" | "in" | "between" | string;
  value: string | string[] | number | number[] | Date | boolean | null;
  value2?: string | string[] | number | number[] | Date | boolean | null;
}

export interface DropdownOption {
  value: string | number;
  label: string;
}
export interface IFilteringOption {
  columnName: string;
  name: string;
  type: "checkbox" | "radio" | "dateRange";
  options?: DropdownOption[] | null;
  isLoading?: boolean;
  conditionalSearch?: boolean;
  onFilterOpen?: () => void;
}

export interface IFilterFieldMapping {
  field: string; // API field name
  operator?: "equals" | "contains" | "in" | "between" | "eq"; // Default operator
  rootLevel?: boolean; // If true, add to root level filters instead of filters array
  transformValue?: (value: unknown) => unknown; // Optional value transformer
}

// Interface for Pagination properties
export interface IPaginationProps {
  totalCount?: number;
  pageNumber?: number;
  totalPages?: number;
  pageSize?: number;
  setTablePageSize?: (value: number) => void;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  fetchData?: (page?: number, size?: number) => Promise<void> | void;
  hasPageSize?: boolean;
  onGotoPage?: boolean;
}

export type TransactionType = "Income" | "Expense";
export type StatusType = "Success" | "Failed";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  account: string;
  status:StatusType;
  amount: number;
  type: TransactionType;
}

