"use client";

import * as React from "react";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { Tabs as ShadCNTabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import type {
  ITabsListHelperProps,
  ITabsTriggerHelperProps,
  ITabsWithProps,
  TabVariant,
  ITabsContentHelperProps,
} from "./types";

export const TabsWithProps = ({
  defaultValue,
  value,
  onValueChange,
  onTabClick,
  className,
  options,
  variant = "default",
  showScrollButtons = true,
  scrollAmount = 200,
  leftArrowIcon,
  rightArrowIcon,
  scrollButtonClassName,
  tabsListClassName,
  tabsTriggerClassName,
  activeTabsTriggerClassName,
  showActiveUnderline = true,
  showContent = true,
  isListPage = true,
  usedInsideModal = false,
}: ITabsWithProps) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = React.useState(false);
  const [showRightScroll, setShowRightScroll] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<string>(
    value || defaultValue || String(options[0]?.value ?? options[0]?.id ?? "1")
  );

  const currentValue = value ?? internalValue;

  const handleTabClick = (tabValue: string | number) => {
    const stringValue = String(tabValue);
    setInternalValue(stringValue);
    onValueChange?.(stringValue);
    const numValue = typeof tabValue === "string" ? parseInt(tabValue, 10) : tabValue;
    onTabClick?.(numValue);
  };

  // Scroll function
  const scrollTabs = React.useCallback(
    (direction: "left" | "right") => {
      if (scrollContainerRef.current) {
        const newScrollPosition =
          direction === "left"
            ? scrollContainerRef.current.scrollLeft - scrollAmount
            : scrollContainerRef.current.scrollLeft + scrollAmount;

        scrollContainerRef.current.scrollTo({
          left: newScrollPosition,
          behavior: "smooth",
        });
      }
    },
    [scrollAmount]
  );

  // Check scroll position and update button visibility
  const checkScrollButtons = React.useCallback(() => {
    if (typeof window === "undefined" || !scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  // Check if scrolling is needed
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const checkScroll = () => {
      checkScrollButtons();
    };

    const timer = setTimeout(() => {
      checkScroll();
    }, 100);

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined" && scrollContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        checkScroll();
      });
      resizeObserver.observe(scrollContainerRef.current);
    }

    window.addEventListener("resize", checkScroll);

    return () => {
      clearTimeout(timer);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", checkScroll);
    };
  }, [options, checkScrollButtons]);

  // Style configurations
  const getStyleClasses = (variant: TabVariant, showUnderline: boolean) => {
    const styles: Record<
      TabVariant,
      {
        container: string;
        trigger: string;
        active: string;
        inactive: string;
        innerContainer?: string;
      }
    > = {
      default: {
        container:
          "w-full justify-start bg-muted/50 p-1 sm:p-1.5 h-auto overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        trigger: cn(
          "px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 md:py-4 text-xs sm:text-sm font-medium transition-all duration-500 ease-out data-[state=active]:shadow-lg data-[state=active]:bg-background data-[state=active]:font-bold data-[state=active]:text-primary data-[state=active]:border-2 data-[state=active]:border-primary/20 will-change-transform whitespace-nowrap shrink-0 cursor-pointer transform hover:scale-[1.02] hover:shadow-md hover:-translate-y-px hover:bg-background/80 relative",
          showUnderline &&
            "after:content-[''] after:pointer-events-none after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[4px] after:rounded-b-md after:z-10 after:scale-x-0 after:opacity-0 after:transition-all after:duration-300 after:origin-center data-[state=active]:after:scale-x-100 data-[state=active]:after:opacity-100 data-[state=active]:after:bg-primary data-[state=active]:after:shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
        ),
        active:
          "shadow-lg bg-background font-bold text-primary border-1 border-primary/20 scale-105",
        inactive: "text-muted-foreground hover:text-foreground",
      },
      pills: {
        container:
          "w-full rounded-full bg-muted p-1.5 sm:p-2 shadow-inner border border-border transition-all duration-500 ease-out relative",
        innerContainer:
          "flex gap-2 sm:gap-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-nowrap items-center",
        trigger:
          "px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98] will-change-transform whitespace-nowrap shrink-0 relative group flex items-center gap-2 cursor-pointer",
        active:
          "bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground shadow-primary/40 font-bold border-2 border-primary/30 ring-2 ring-primary/20 z-10",
        inactive:
          "text-muted-foreground/90 hover:text-foreground hover:bg-background/80 hover:shadow-md bg-background/40 backdrop-blur-sm border border-transparent hover:border-border/50",
      },
    };

    return styles[variant];
  };

  const styleClasses = getStyleClasses(variant, showActiveUnderline);
  const squareScrollButtonClassName =
    "rounded-md bg-background/90 hover:bg-background border border-border shadow-md hover:shadow-lg transition-all duration-200 p-1.5 text-foreground cursor-pointer";
  const defaultScrollButtonClassName =
    variant === "default" ? squareScrollButtonClassName : squareScrollButtonClassName;

  const containerPadding = usedInsideModal
    ? "!p-0"
    : isListPage
      ? "lg:pt-4 xl:px-4 pt-2 px-2"
      : "lg:pt-4 lg:px-4 pt-2 px-2";

  // Render different variants
  const renderTabs = () => {
    // Pills variant
    if (variant === "pills") {
      // Custom render for non-ShadCN variants
      return (
        <div className={cn("w-full", className)}>
          <div className={cn("w-full relative", containerPadding)}>
            <div className={cn(styleClasses.container)}>
              {/* Left fade overlay */}
              {showScrollButtons && showLeftScroll && (
                <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-linear-to-r from-muted to-transparent pointer-events-none z-20 rounded-l-full" />
              )}
              {showScrollButtons && showLeftScroll && (
                <button
                  onClick={() => scrollTabs("left")}
                  className={cn(
                    "absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 z-30 rounded-full bg-background/90 hover:bg-background border border-border transition-all duration-200 p-1.5",
                    scrollButtonClassName
                  )}
                  aria-label="Scroll left"
                >
                  {leftArrowIcon || <ArrowLeftIcon />}
                </button>
              )}
              <div
                ref={scrollContainerRef}
                onScroll={checkScrollButtons}
                className={cn(styleClasses.innerContainer, "relative")}
                style={{ scrollBehavior: "smooth" }}
              >
                {options.map((option) => {
                  const optionValue =
                    option.value ?? option.id ?? String(option.id ?? option.value);
                  const isDisabled = option.disabled || false;
                  const isActive = currentValue === String(optionValue);

                  return (
                    <button
                      key={optionValue}
                      onClick={() => !isDisabled && handleTabClick(optionValue)}
                      disabled={isDisabled}
                      className={cn(
                        styleClasses.trigger,
                        isActive ? styleClasses.active : styleClasses.inactive,
                        option.disabled && "opacity-50 cursor-not-allowed",
                        option.icon && "flex items-center gap-2",
                        tabsTriggerClassName,
                        isActive && activeTabsTriggerClassName
                      )}
                    >
                      {option.icon && (
                        <span
                          className={cn(
                            "shrink-0 transition-all duration-300 flex items-center justify-center",
                            isActive ? "scale-110" : "scale-100 group-hover:scale-105"
                          )}
                        >
                          {React.isValidElement(option.icon)
                            ? React.cloneElement(option.icon as React.ReactElement<any>, {
                                className: cn(
                                  "w-4 h-4 sm:w-5 sm:h-5",
                                  isActive ? "text-primary-foreground" : "text-muted-foreground",
                                  (option.icon as React.ReactElement<any>).props?.className
                                ),
                                strokeWidth: isActive ? 2.5 : 2,
                              })
                            : option.icon}
                        </span>
                      )}
                      <span
                        className={cn("transition-colors duration-300", isActive && "font-bold")}
                      >
                        {option.label}
                      </span>
                      {option.count !== undefined && (
                        <span
                          className={cn(
                            "ml-1.5 text-xs font-medium px-1.5 py-0.5 rounded-full transition-colors duration-300",
                            isActive
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted/50 text-muted-foreground"
                          )}
                        >
                          {option.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* Right fade overlay */}
              {showScrollButtons && showRightScroll && (
                <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-linear-to-l from-muted to-transparent pointer-events-none z-20 rounded-r-full" />
              )}
              {showScrollButtons && showRightScroll && (
                <button
                  onClick={() => scrollTabs("right")}
                  className={cn(
                    "absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 z-30 rounded-full bg-background/90 hover:bg-background border border-border shadow-md hover:shadow-lg transition-all duration-200 p-1.5",
                    scrollButtonClassName
                  )}
                  aria-label="Scroll right"
                >
                  {rightArrowIcon || <ArrowRightIcon />}
                </button>
              )}
            </div>
          </div>

          {showContent && (
            <div className="mt-3 sm:mt-4 relative min-h-[150px] sm:min-h-[200px] overflow-hidden">
              {options.map((option) => {
                const optionValue = option.value ?? option.id ?? String(option.id ?? option.value);
                if (currentValue === String(optionValue)) {
                  return (
                    <div
                      key={optionValue}
                      className="transition-all duration-500 ease-out opacity-100"
                    >
                      {option.content}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      );
    }

    // Default variant using ShadCN Tabs with pill-like scroll/fade controls
    return (
      <div className={cn("relative w-full", showScrollButtons && containerPadding, className)}>
        <ShadCNTabs
          defaultValue={defaultValue}
          value={currentValue}
          onValueChange={(val) => {
            setInternalValue(val);
            onValueChange?.(val);
            const numValue = parseInt(val, 10);
            if (!isNaN(numValue)) {
              onTabClick?.(numValue);
            }
          }}
          className="w-full"
        >
          <div className="w-full relative">
            {/* Left fade + button */}
            {showScrollButtons && showLeftScroll && (
              <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-12 bg-linear-to-r from-muted to-transparent pointer-events-none z-20 rounded-l-md" />
            )}
            {showScrollButtons && showLeftScroll && (
              <button
                onClick={() => scrollTabs("left")}
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 z-30",
                  defaultScrollButtonClassName,
                  scrollButtonClassName
                )}
                aria-label="Scroll left"
              >
                {leftArrowIcon || <ArrowLeftIcon />}
              </button>
            )}

            {/* Scrollable Tabs Container */}
            <TabsList
              ref={scrollContainerRef}
              onScroll={checkScrollButtons}
              className={cn(
                "inline-flex flex-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full min-w-0 gap-1 bg-muted/20 rounded-md p-1",
                styleClasses.container,
                showScrollButtons && (showLeftScroll || showRightScroll) && "px-8 sm:px-10",
                tabsListClassName
              )}
              style={{ scrollBehavior: "smooth" }}
            >
              {options.map((option) => {
                const optionValue = option.value ?? option.id ?? String(option.id ?? option.value);
                const isDisabled = option.disabled || false;

                return (
                  <TabsTriggerHelper
                    key={optionValue}
                    value={String(optionValue)}
                    onClick={() => !isDisabled && handleTabClick(optionValue)}
                    disabled={isDisabled}
                    className={cn(
                      styleClasses.trigger,
                      isDisabled && "opacity-50 cursor-not-allowed",
                      option.icon && "flex items-center gap-2",
                      tabsTriggerClassName,
                      activeTabsTriggerClassName
                    )}
                  >
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <span className="ml-1 text-xs opacity-75">({option.count})</span>
                    )}
                  </TabsTriggerHelper>
                );
              })}
            </TabsList>

            {/* Right fade + button */}
            {showScrollButtons && showRightScroll && (
              <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-12 bg-linear-to-l from-muted to-transparent pointer-events-none z-20 rounded-r-md" />
            )}
            {showScrollButtons && showRightScroll && (
              <button
                onClick={() => scrollTabs("right")}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 z-30",
                  defaultScrollButtonClassName,
                  scrollButtonClassName
                )}
                aria-label="Scroll right"
              >
                {rightArrowIcon || <ArrowRightIcon />}
              </button>
            )}
          </div>

          {showContent &&
            options.map((option) => {
              const optionValue = option.value ?? option.id ?? String(option.id ?? option.value);
              return (
                <TabsContentHelper
                  key={optionValue}
                  value={String(optionValue)}
                  children={option.content}
                />
              );
            })}
        </ShadCNTabs>
      </div>
    );
  };

  return renderTabs();
};

export const TabsListWithProps = ({ children, className, ...props }: ITabsListHelperProps) => {
  return (
    <TabsList className={className} {...props}>
      {children}
    </TabsList>
  );
};

export const TabsTriggerHelper = ({
  value,
  children,
  className,
  ...props
}: ITabsTriggerHelperProps) => {
  return (
    <TabsTrigger value={value} className={className} {...props}>
      {children}
    </TabsTrigger>
  );
};

export const TabsContentHelper = ({
  value,
  children,
  className,
  ...props
}: ITabsContentHelperProps) => {
  return (
    <TabsContent value={value} className={className} {...props}>
      {children}
    </TabsContent>
  );
};

export default TabsWithProps;
