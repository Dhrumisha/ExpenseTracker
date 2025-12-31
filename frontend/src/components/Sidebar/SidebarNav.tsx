"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { NavItem, SidebarNavProps } from "@/types/common/redux/nav-slice.types";
import { getModuleIcon } from "@/utils/constants";

// Helper function to normalize paths
const normalizePath = (path: string): string => path.replace(/\/$/, "");

// Helper function to check if current path matches or starts with item path
const pathMatches = (itemHref: string, currentPath: string): boolean => {
  const normalizedItemPath = normalizePath(itemHref);
  const normalizedCurrentPath = normalizePath(currentPath);

  // Exact match
  if (normalizedItemPath === normalizedCurrentPath) return true;

  // Current path starts with item path (e.g., /users matches /users/edit/123)
  return normalizedCurrentPath.startsWith(`${normalizedItemPath}/`);
};

export function SidebarNav({ items = {} }: { items: SidebarNavProps }) {
  const pathname = usePathname();

  // Track which top-level dropdown is open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Helper to check if an item contains the active page
  const checkItemActive = useCallback(
    (item: NavItem): boolean => {
      // Check if current path matches this item's href
      if (item.href && pathMatches(item.href, pathname)) return true;

      if (!item.children) return false;

      const checkChildActive = (children: Record<string, NavItem>): boolean => {
        return Object.values(children).some((child) => {
          // Check if current path matches child's href
          if (child.href && pathMatches(child.href, pathname)) return true;

          if (child.children) return checkChildActive(child.children);
          return false;
        });
      };

      return checkChildActive(item.children);
    },
    [pathname]
  );

  // Initialize openDropdown with the active item on mount
  useEffect(() => {
    // Find the parent that contains the currently active child
    const activeEntry = Object.entries(items).find(([key, item]) => {
      // Skip "is_super" key
      if (key === "is_super") return false;
      if (!item) return false;

      const hasChildren = !!Object.keys(item.children ?? {}).length;
      if (!hasChildren) return false;

      // Check if any direct child is active (not just nested children)
      const hasActiveDirectChild = Object.values(item.children ?? {}).some((child) => {
        if (child?.href && pathMatches(child.href, pathname)) return true;

        // Also check nested children
        if (child?.children) {
          const checkNestedActive = (children: Record<string, NavItem>): boolean => {
            return Object.values(children).some((nestedChild) => {
              if (nestedChild.href && pathMatches(nestedChild.href, pathname)) return true;
              if (nestedChild.children) return checkNestedActive(nestedChild.children);
              return false;
            });
          };
          return checkNestedActive(child.children);
        }
        return false;
      });

      return hasActiveDirectChild;
    });

    const activeKey = activeEntry?.[0];

    if (activeKey && openDropdown === null) {
      setTimeout(() => {
        setOpenDropdown(activeKey);
      }, 0);
    }
  }, [items, pathname, openDropdown]);

  return (
    <SidebarMenu className="space-y-2">
      {Object.entries(items)
        .filter(([key, item]) => {
          // Filter out "is_super" and null items
          if (key === "is_super") return false;
          return item != null;
        })
        .map(([key, item]) => {
          const hasChildren = !!Object.keys(item.children ?? {}).length;
          const isActive = hasChildren && checkItemActive(item);

          return (
            <SidebarNavItem
              key={key}
              title={key}
              item={item}
              isOpen={openDropdown === key}
              onOpenChange={(open) => {
                // When opening a dropdown, close all others
                setOpenDropdown(open ? key : null);
              }}
              defaultOpen={isActive}
            />
          );
        })}
    </SidebarMenu>
  );
}

function SidebarNavItem({
  title,
  item,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onOpenChange,
}: {
  title: string;
  item: NavItem;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const pathname = usePathname();

  const hasChildren = !!Object.keys(item.children ?? {}).length;

  const isActive = useMemo(() => {
    // Check if current path matches this item's href
    if (item.href && pathMatches(item.href, pathname)) return true;

    if (!hasChildren) return false;

    const checkChildActive = (children: Record<string, NavItem>): boolean => {
      return Object.values(children).some((child) => {
        // Check if current path matches child's href
        if (child.href && pathMatches(child.href, pathname)) return true;

        if (child.children) return checkChildActive(child.children);
        return false;
      });
    };

    return checkChildActive(item.children ?? {});
  }, [pathname, item, hasChildren]);

  // Use controlled state if provided, otherwise use local state
  const [localIsOpen, setLocalIsOpen] = useState(defaultOpen ?? isActive);
  const isOpen = controlledIsOpen ?? localIsOpen;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (onOpenChange) {
        onOpenChange(open);
      } else {
        setLocalIsOpen(open);
      }
    },
    [onOpenChange]
  );

  // Only auto-open if not controlled (parent handles controlled state)
  useEffect(() => {
    if (isActive && hasChildren && controlledIsOpen === undefined) {
      setTimeout(() => {
        handleOpenChange(true);
      }, 0);
    }
  }, [isActive, hasChildren, handleOpenChange, controlledIsOpen]);

  if (!hasChildren && item.href) {
    const isCurrentPage = pathMatches(item.href, pathname);
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className={cn(
            "transition-all duration-200 flex-col items-start h-auto py-2",
            isCurrentPage && "bg-primary text-primary-foreground hover:text-primary-foreground"
          )}
        >
          <Link href={item.href} className="flex items-center gap-2 w-full">
            <div className="flex items-center gap-2 w-full">
              {getModuleIcon(item?.icon as string, "md")}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium">{title}</span>
                {item.module_description && (
                  <span
                    className={cn(
                      "text-xs text-muted-foreground truncate",
                      isCurrentPage && "text-primary-foreground"
                    )}
                  >
                    {item.module_description}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={handleOpenChange} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className={cn(
              "w-full transition-all duration-200 flex-col items-start h-auto py-2",
              isOpen && "bg-primary text-primary-foreground hover:text-primary-foreground"
            )}
          >
            <div className="flex items-center gap-2 w-full">
              {getModuleIcon(item?.icon as string, "md")}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium">{title}</span>
                {item.module_description && (
                  <span
                    className={cn(
                      "text-xs text-muted-foreground truncate",
                      isOpen && "text-primary-foreground"
                    )}
                  >
                    {item.module_description}
                  </span>
                )}
              </div>
              <ChevronRight
                className={cn(
                  "ml-auto transition-transform duration-200 shrink-0",
                  isOpen && "rotate-90"
                )}
              />
            </div>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="space-y-1.5 mt-2">
            {Object.entries(item.children ?? {})
              .filter(([, child]) => child != null)
              .map(([childKey, child]) => (
                <SidebarMenuSubItem key={child.href ?? childKey}>
                  <SidebarNavSubItem
                    title={childKey}
                    item={child}
                    parentKey={`${title}-${childKey}`}
                  />
                </SidebarMenuSubItem>
              ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

// Context to track open sub-items at the same level
const SubItemContext = createContext<{
  openSubItem: string | null;
  setOpenSubItem: (key: string | null) => void;
} | null>(null);

function SidebarNavSubItem({
  title,
  item,
  parentKey,
}: {
  title: string;
  item: NavItem;
  parentKey?: string;
}) {
  const pathname = usePathname();
  const subItemContext = useContext(SubItemContext);

  // All hooks must be called before any early returns
  const hasChildren = !!Object.keys(item.children ?? {}).length;
  const itemKey = parentKey ? `${parentKey}-${title}` : title;

  const isActive = useMemo(() => {
    if (!item) return false;

    // Check if current path matches this item's href
    if (item.href && pathMatches(item.href, pathname)) return true;

    if (!hasChildren) return false;

    const checkChildActive = (children: Record<string, NavItem>): boolean => {
      return Object.values(children).some((child) => {
        // Check if current path matches child's href
        if (child.href && pathMatches(child.href, pathname)) return true;

        if (child.children) return checkChildActive(child.children);
        return false;
      });
    };

    return checkChildActive(item.children ?? {});
  }, [pathname, item, hasChildren]);

  // Use context if available, otherwise use local state
  const [localIsOpen, setLocalIsOpen] = useState(isActive);
  const isOpen = subItemContext ? subItemContext.openSubItem === itemKey : localIsOpen;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (subItemContext) {
        subItemContext.setOpenSubItem(open ? itemKey : null);
      } else {
        setLocalIsOpen(open);
      }
    },
    [subItemContext, itemKey]
  );

  useEffect(() => {
    if (isActive && hasChildren) {
      setTimeout(() => {
        handleOpenChange(true);
      }, 0);
    }
  }, [isActive, hasChildren, handleOpenChange]);

  // Create context provider for nested items at this level
  const [openSubItem, setOpenSubItem] = useState<string | null>(null);
  const contextValue = useMemo(() => ({ openSubItem, setOpenSubItem }), [openSubItem]);

  // Guard against undefined/null item - must be after all hooks
  if (!item) return null;

  if (!hasChildren && item.href) {
    const isCurrentPage = pathMatches(item.href, pathname);
    return (
      <SidebarMenuSubButton
        asChild
        isActive={isCurrentPage}
        className={cn(
          "transition-all duration-200 flex-col items-start h-auto py-2",
          isCurrentPage &&
            "bg-primary text-primary-foreground hover:text-primary-foreground data-[active=true]:text-sidebar-primary-foreground"
        )}
      >
        <Link href={item.href} className="flex flex-col w-full">
          <span className="text-sm font-medium">{title}</span>
        </Link>
      </SidebarMenuSubButton>
    );
  }

  return (
    <SubItemContext.Provider value={contextValue}>
      <Collapsible open={isOpen} onOpenChange={handleOpenChange} className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton
            className={cn(
              "w-full transition-all duration-200 flex-col items-start h-auto py-2",
              isOpen &&
                "bg-primary text-primary-foreground hover:text-primary-foreground data-[active=true]:text-sidebar-primary-foreground"
            )}
          >
            <div className="flex items-center gap-2 w-full">
              {getModuleIcon(item?.icon as string, "md")}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium">{title}</span>
              </div>
              <ChevronRight
                className={cn(
                  "ml-auto transition-transform duration-200 shrink-0",
                  isOpen && "rotate-90"
                )}
              />
            </div>
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="ml-3 border-l border-sidebar-border pl-2">
            {Object.entries(item.children ?? {})
              .filter(([, child]) => child != null)
              .map(([childKey, child]) => (
                <SidebarMenuSubItem key={child.href ?? childKey}>
                  <SidebarNavSubItem title={childKey} item={child} parentKey={itemKey} />
                </SidebarMenuSubItem>
              ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SubItemContext.Provider>
  );
}
