interface ISelectOption {
  label: string;
  value: number | string;
  disabled?: boolean;
}

export interface ISelectProps {
  label?: string;
  asterisk?: boolean;
  name?: string;
  id?: string;
  placeholder?: string;
  options: ISelectOption[];
  defaultValue?: string | number;
  onChange?: (value: string) => void;
  disabled?: boolean;
  isUsedWithoutPermission?: boolean;
  isInline?: boolean;
  labelClassName?: string;
  wrapperClassName?: string;
  contentClassName?: string;
  tooltip?: React.ReactNode;
  tooltipIcon?: React.ReactNode;
  formik?: boolean;
  errorMessage?: string;
  displayError?: boolean;
  asyncPagination?: boolean;
  onLoadMore?: (page: number, query: string) => Promise<ISelectOption[]>;
  hasMore?: boolean;
  debounceMs?: number;
  isLoading?: boolean;
  showSearch?: boolean;
}
