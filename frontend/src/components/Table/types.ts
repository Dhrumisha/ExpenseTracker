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
