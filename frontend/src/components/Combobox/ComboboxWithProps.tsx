"use client";

import { useEffect, useState, useRef, useCallback } from "react";

import { useField } from "formik";
import { Check, ChevronsUpDown, CircleQuestionMark, Loader2 } from "lucide-react";

import type { ISelectProps } from "@/components/Combobox/types";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { FormErrorMessage } from "../FormErrorMessage/FormErrorMessage";
import { TooltipWithProps } from "../Tooltip/TooltipWithProps";

export const ComboboxWithProps: React.FC<ISelectProps> = ({
  label,
  tooltip,
  tooltipIcon,
  asterisk,
  name,
  id,
  placeholder = "Select an option",
  options,
  defaultValue,
  onChange,
  disabled,
  isUsedWithoutPermission = false,
  isInline = false,
  labelClassName = "",
  wrapperClassName = "",
  contentClassName = "",
  // Formik integration props
  formik = false,
  errorMessage: errorMessageProp,
  displayError = true,
  // Async pagination props
  asyncPagination = false,
  onLoadMore,
  hasMore = false,
  debounceMs = 300,
  isLoading: externalLoading = false,
  // Search bar visibility
  showSearch = true,
}) => {

  const isDisabled = isUsedWithoutPermission || disabled;

  // Formik integration - use useField when formik=true and name is provided
  // Always call useField to satisfy React hooks rules, but only use it when formik=true
  const fieldName = formik && name ? name : "__combobox_dummy__";
  const [field, meta, helpers] = useField<string>(fieldName);

  const isFormikMode = formik && name && fieldName !== "__combobox_dummy__";

  // Determine value: Formik mode uses field.value, otherwise use defaultValue
  const formikValue = isFormikMode ? field.value || "" : undefined;
  const effectiveDefaultValue = formikValue !== undefined ? formikValue : defaultValue;

  const fieldId = id || name || "combobox";
  const fieldError = isFormikMode ? meta.error : errorMessageProp;
  const hasError = isFormikMode ? meta.touched && meta.error : Boolean(errorMessageProp);
  const showError = Boolean(displayError && hasError && fieldError);

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedOptions, setLoadedOptions] = useState(options);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollThrottleRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef(false);

  const getStringValue = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return "";
    if (val === 0 || val === "0") return "";
    const strVal = String(val);
    if (strVal === "0") return "";
    return strVal;
  };

  const [value, setValue] = useState(getStringValue(effectiveDefaultValue));

  // Sync with Formik field value when in Formik mode
  useEffect(() => {
    if (isFormikMode) {
      const formikValueStr = getStringValue(field.value);
      setValue(formikValueStr);
    } else {
      const newValue = getStringValue(effectiveDefaultValue);
      setValue(newValue);
    }
  }, [isFormikMode, field.value, effectiveDefaultValue]);

  // Update loaded options when options prop changes
  useEffect(() => {
    if (!asyncPagination) {
      setLoadedOptions(options);
    } else if (options.length > 0 && loadedOptions.length === 0) {
      // If initial options are provided for async mode, use them
      setLoadedOptions(options);
    }
  }, [options, asyncPagination]);

  // Load more options function
  const loadMoreOptions = useCallback(
    async (page: number, query: string, reset: boolean = false) => {
      if (!onLoadMore || isLoadingMore || isLoadingRef.current) return;

      isLoadingRef.current = true;
      setIsLoadingMore(true);
      try {
        const newOptions = await onLoadMore(page, query);
        if (reset) {
          setLoadedOptions(newOptions);
        } else {
          setLoadedOptions((prev) => [...prev, ...newOptions]);
        }
        setCurrentPage(page);
      } catch (error) {
        console.error("Error loading more options:", error);
      } finally {
        setIsLoadingMore(false);
        setIsInitialLoad(false);
        isLoadingRef.current = false;
      }
    },
    [onLoadMore, isLoadingMore]
  );

  // Debounce search query
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      if (asyncPagination && onLoadMore) {
        setCurrentPage(1);
        setLoadedOptions([]);
        setIsInitialLoad(true);
        loadMoreOptions(1, searchQuery, true);
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, debounceMs, asyncPagination, onLoadMore, loadMoreOptions]);

  // Initial load for async pagination when popover opens
  useEffect(() => {
    if (
      asyncPagination &&
      onLoadMore &&
      open &&
      loadedOptions.length === 0 &&
      !isInitialLoad &&
      !isLoadingMore &&
      debouncedSearchQuery === ""
    ) {
      setIsInitialLoad(true);
      loadMoreOptions(1, "", true);
    }
  }, [
    asyncPagination,
    onLoadMore,
    open,
    debouncedSearchQuery,
    loadMoreOptions,
    loadedOptions.length,
    isInitialLoad,
    isLoadingMore,
  ]);

  // Handle scroll for pagination with throttling
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      // Throttle scroll events to prevent excessive calls
      if (scrollThrottleRef.current) {
        return;
      }

      scrollThrottleRef.current = setTimeout(() => {
        scrollThrottleRef.current = null;
      }, 100);

      if (!asyncPagination || !hasMore || isLoadingMore || externalLoading || isLoadingRef.current)
        return;

      const target = e.currentTarget;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;

      // Load more only when scrolled to the very bottom (within 5px threshold)
      // This ensures we only load when user has actually reached the end
      if (scrollBottom <= 5 && scrollBottom >= -5) {
        loadMoreOptions(currentPage + 1, debouncedSearchQuery, false);
      }
    },
    [
      asyncPagination,
      hasMore,
      isLoadingMore,
      externalLoading,
      currentPage,
      debouncedSearchQuery,
      loadMoreOptions,
    ]
  );

  // Reset when popover closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setDebouncedSearchQuery("");
      if (asyncPagination) {
        setCurrentPage(1);
        setIsInitialLoad(false);
        isLoadingRef.current = false;
        // Keep loaded options for better UX when reopening
      }
    }
  }, [open, asyncPagination]);

  // Cleanup throttles on unmount
  useEffect(() => {
    return () => {
      if (scrollThrottleRef.current) {
        clearTimeout(scrollThrottleRef.current);
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Helper to check if we should show placeholder
  const shouldShowPlaceholder = (val: string): boolean => {
    return !val || val === "" || val === "0";
  };

  // Filter options based on search query (for non-async mode)
  // Only filter if search is enabled and there's a search query
  const filteredOptions = asyncPagination
    ? loadedOptions
    : showSearch && searchQuery
      ? loadedOptions.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : loadedOptions;

  const handleSelect = (currentValue: string) => {
    const currentValueStr = String(currentValue);
    const valueStr = String(value);
    const newValue = valueStr === currentValueStr ? "" : currentValueStr;
    setValue(newValue);

    // Update Formik if in Formik mode
    if (isFormikMode) {
      helpers.setValue(newValue);
      helpers.setTouched(true, false);
    }

    // Call custom onChange if provided
    onChange?.(newValue);
    setOpen(false);
  };

  const labelEl = label && (
    <label htmlFor={id || name} className={cn("inline-flex items-center text-sm", labelClassName)}>
      {label}
      {asterisk && <span className="text-expense ml-1">*</span>}
    </label>
  );

  const tooltipEL = tooltip && (
    <TooltipWithProps content={tooltip}>
      {tooltipIcon || <CircleQuestionMark size={16} className="text-gray-500 cursor-pointer" />}
    </TooltipWithProps>
  );
  return (
    <div
      className={cn(
        "flex gap-2 ",
        isInline ? "lg:flex-row flex-col" : "flex-col",
        wrapperClassName
      )}
    >
      <div className="flex gap-2">
        {labelEl}
        {tooltipEL}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            id={fieldId}
            role="combobox"
            aria-controls={`${fieldId}-listbox`}
            aria-expanded={open}
            aria-invalid={!!showError}
            aria-describedby={showError ? `${fieldId}-error` : undefined}
            className={cn(
              "flex w-full cursor-pointer items-center justify-between h-9 rounded-md border border-input bg-surface px-3 py-1 text-sm shadow-sm",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-zinc-900 dark:border-zinc-700",
              isDisabled && "opacity-60 cursor-not-allowed",
              showError && "border-red-500 focus-visible:ring-red-500"
            )}
          >
            <span className={shouldShowPlaceholder(value) ? "text-muted-foreground" :"text-black dark:text-white"}>
              {value && value !== ""
                ? options.find((o) => String(o.value) === value)?.label
                : placeholder}
            </span>
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className={cn("w-[var(--radix-popover-trigger-width)] p-0", contentClassName)}
        >
          <Command className="bg-surface text-foreground border border-border">
            {showSearch && (
              <CommandInput
                placeholder="Search..."
                className="h-9"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            )}

            <CommandList id={`${fieldId}-listbox`} ref={scrollContainerRef} onScroll={handleScroll} className="max-h-[300px]">
              <CommandEmpty>
                {isInitialLoad || isLoadingMore ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "No results found."
                )}
              </CommandEmpty>

              <CommandGroup>
                {filteredOptions.map((opt, index) => (
                  <CommandItem
                    key={`${opt.value}-${index}`}
                    value={opt.label}
                    disabled={opt.disabled}
                    onSelect={() => handleSelect(String(opt.value))}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === String(opt.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                ))}
                {asyncPagination && (isLoadingMore || externalLoading) && hasMore && (
                  <CommandItem disabled className="justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Loading more...</span>
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormErrorMessage error={fieldError} id={`${fieldId}-error`} displayError={showError} />
    </div>
  );
};
