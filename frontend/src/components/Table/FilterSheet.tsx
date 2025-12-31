"use client";
// 1. React
import React, { useState, useEffect } from "react";

// 2. Third-party libs
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";

// 3. ShadCN components
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatForDateInput, toDateOrNull } from "@/utils/date";

// 4. Types
import type { IFilteringOption } from "./types";

type FilterValue =
  | string
  | number
  | (string | number)[]
  | { from: Date | null; to: Date | null }
  | null;

const isDateRange = (val: unknown): val is { from: Date | null; to: Date | null } =>
  typeof val === "object" && val !== null && "from" in val && "to" in val;

interface IFilterDialogProps {
  filters: IFilteringOption[];
  onApply: (filters: Record<string, unknown>) => void;
}

const FilterDialog: React.FC<IFilterDialogProps> = ({ filters, onApply }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, FilterValue>>({});
  const [optionSearch, setOptionSearch] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  //  Load filter options dynamically on open
  useEffect(() => {
    if (open) {
      filters.forEach((f) => f.onFilterOpen?.());
    }
  }, [open, filters]);

  // Toggle accordion section
  const toggleSection = (name: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Handle value changes
  const handleCheckboxChange = (col: string, val: string | number) => {
    setSelectedFilters((prev) => {
      const current = (prev[col] as (string | number)[]) || [];
      const updated = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
      return { ...prev, [col]: updated };
    });
  };

  const handleRadioChange = (col: string, val: string) =>
    setSelectedFilters((prev) => ({ ...prev, [col]: val }));

  const handleDateRangeChange = (col: string, range: { from: Date | null; to: Date | null }) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [col]: range,
    }));
  };

  // Apply filters
  const handleApply = () => {
    const active = Object.fromEntries(
      Object.entries(selectedFilters).filter(([_, val]) => {
        void _;
        return Array.isArray(val) ? val.length > 0 : val !== null && val !== "";
      })
    );
    onApply(active);
    setOpen(false);
  };

  const handleClearAll = () => setSelectedFilters({});
  const handleClearOne = (col: string) =>
    setSelectedFilters((prev) => {
      const copy = { ...prev };
      delete copy[col];
      return copy;
    });

  const filtered = filters.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  const activeFilterCount = Object.values(selectedFilters).filter((val) =>
    Array.isArray(val) ? val.length > 0 : val !== null && val !== ""
  ).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 text-xs text-muted-foreground">({activeFilterCount})</span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>More Filters ({activeFilterCount})</SheetTitle>
        </SheetHeader>

        {/* Search */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search filters..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Filters Scroll Area */}
          <ScrollArea className="h-300 px-6">
            <div className="space-y-4 pb-4">
              {filtered.map((filter) => {
                const selected = selectedFilters[filter.columnName];
                const isExpanded = expandedSections[filter.columnName] ?? false;

                return (
                  <div key={filter.columnName} className="border-b pb-4 last:border-none">
                    <button
                      onClick={() => toggleSection(filter.columnName)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <span>{filter.name}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-3">
                        {filter.isLoading ? (
                          <p className="text-xs text-muted-foreground">Loading...</p>
                        ) : (
                          <>
                            {filter.conditionalSearch && (
                              <Input
                                placeholder={`Search ${filter.name}...`}
                                value={optionSearch[filter.columnName] || ""}
                                onChange={(e) =>
                                  setOptionSearch((prev) => ({
                                    ...prev,
                                    [filter.columnName]: e.target.value,
                                  }))
                                }
                                className="h-8 text-xs mb-2"
                              />
                            )}

                            {/* Checkbox */}
                            {filter.type === "checkbox" && (
                              <div className="space-y-2 max-h-52 overflow-y-auto">
                                {(filter.options ?? [])
                                  .filter((opt) =>
                                    opt.label
                                      .toLowerCase()
                                      .includes(
                                        (optionSearch[filter.columnName] || "").toLowerCase()
                                      )
                                  )
                                  .map((opt) => (
                                    <label
                                      key={opt.value}
                                      className="flex items-center gap-2 text-sm cursor-pointer"
                                    >
                                      <Checkbox
                                        checked={
                                          Array.isArray(selected)
                                            ? selected.includes(opt.value)
                                            : false
                                        }
                                        onCheckedChange={() =>
                                          handleCheckboxChange(filter.columnName, opt.value)
                                        }
                                      />
                                      {opt.label}
                                    </label>
                                  ))}
                              </div>
                            )}

                            {/* Radio */}
                            {filter.type === "radio" && (
                              <RadioGroup
                                onValueChange={(val) => handleRadioChange(filter.columnName, val)}
                                value={
                                  typeof selected === "string" || typeof selected === "number"
                                    ? String(selected)
                                    : ""
                                }
                              >
                                {(filter.options ?? []).map((opt) => (
                                  <div key={opt.value} className="flex items-center gap-2 text-sm">
                                    <RadioGroupItem
                                      value={String(opt.value)}
                                      id={`${filter.columnName}-${opt.value}`}
                                    />
                                    <label htmlFor={`${filter.columnName}-${opt.value}`}>
                                      {opt.label}
                                    </label>
                                  </div>
                                ))}
                              </RadioGroup>
                            )}

                            {/* Date Range*/}
                            {filter.type === "dateRange" && (
                              <div className="flex flex-col gap-2">
                                <div>
                                  <label className="text-xs text-muted-foreground">From</label>
                                  <Input
                                    type="date"
                                    value={
                                      isDateRange(selected) && selected.from
                                        ? formatForDateInput(selected.from)
                                        : ""
                                    }
                                    onChange={(e) => {
                                      handleDateRangeChange(filter.columnName, {
                                        from: toDateOrNull(e.target.value),
                                        to: isDateRange(selected) ? selected.to : null,
                                      });
                                    }}
                                  />
                                </div>

                                <div>
                                  <label className="text-xs text-muted-foreground">To</label>
                                  <Input
                                    type="date"
                                    value={
                                      isDateRange(selected) && selected.to
                                        ? formatForDateInput(selected.to)
                                        : ""
                                    }
                                    onChange={(e) => {
                                      handleDateRangeChange(filter.columnName, {
                                        from: isDateRange(selected) ? selected.from : null,
                                        to: toDateOrNull(e.target.value),
                                      });
                                    }}
                                  />
                                </div>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleClearOne(filter.columnName)}
                                >
                                  Clear Range
                                </Button>
                              </div>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleClearOne(filter.columnName)}
                              disabled={
                                !selected || (Array.isArray(selected) && selected.length === 0)
                              }
                            >
                              Clear
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <p className="text-center text-sm text-muted-foreground pt-4">
                  No matching filters found.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="flex justify-between px-6 py-4 border-t border bg-background ">
          <Button variant="outline" onClick={handleClearAll}>
            Clear
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDialog;
