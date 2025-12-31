"use client";

import React, { useEffect, useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux";
import { navigationActions } from "@/redux/slice/navigationSlice";
import { getSidebarItems } from "@/services/sidebar/sidebar.service";
import type { SidebarNavProps } from "@/types/common/redux/nav-slice.types";

import { SidebarNav } from "./SidebarNav";

export interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  groupLabel?: string;
  defaultOpenItems?: string[];
  groups?: {
    label?: string;
    items: SidebarNavProps;
    defaultOpen?: boolean;
  }[];
  className?: string;
}

export function AdminSidebar({
  header,
  footer,
  groupLabel,
  defaultOpenItems = [],
  groups,
  className,
  ...props
}: AdminSidebarProps) {
  const dispatch = useDispatch();

  const user = useAppSelector((state) => state.user);

  const reduxSidebarItems = useAppSelector((state) => state.navigation.sidebarItems);

  // Fetch sidebar items from API
  const { data: apiSidebarItems } = useQuery({
    queryKey: ["sidebarItems"],
    queryFn: async () => getSidebarItems(user.user_id as number),
    enabled: !!user?.user_id,
    // staleTime: 0, // Always consider data stale so refetch works
  });

  // Update Redux whenever API data changes (initial load or refetch)
  useEffect(() => {
    if (apiSidebarItems) {
      dispatch(navigationActions.setSidebarItems(apiSidebarItems as unknown as SidebarNavProps));
    }
  }, [apiSidebarItems, dispatch]);

  // Use Redux data for rendering (which is always synced with API data)
  const sidebarItems = reduxSidebarItems;

  // Memoize items rendering to avoid unnecessary re-renders
  const renderMainItems = useMemo(() => {
    if (!sidebarItems) return null;

    return (
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          {groupLabel && (
            <SidebarGroupLabel
              asChild
              className="text-sm font-semibold text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary-foreground rounded-md cursor-pointer"
            >
              <CollapsibleTrigger>
                {groupLabel}
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
          )}
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarNav items={sidebarItems as SidebarNavProps} />
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    );
  }, [sidebarItems, groupLabel, defaultOpenItems]);

  // Memoize groups rendering
  const renderGroups = useMemo(() => {
    if (!groups?.length) return null;

    return groups.map((group, index) => (
      <Collapsible
        key={group.label ?? index}
        defaultOpen={group.defaultOpen ?? true}
        className="group/collapsible"
      >
        <SidebarGroup>
          {group.label && (
            <SidebarGroupLabel
              asChild
              className="text-sm font-semibold text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary-foreground rounded-md cursor-pointer"
            >
              <CollapsibleTrigger>
                {group.label}
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
          )}
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarNav items={sidebarItems as SidebarNavProps} />
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    ));
  }, [groups, defaultOpenItems]);

  return (
    <Sidebar className={cn("border-r w-72 bg-sidebar", className)} {...props}>
      {header && <AdminSidebarHeader>{header}</AdminSidebarHeader>}

      <SidebarContent className="gap-0 bg-sidebar pt-16">
        {renderMainItems}
        {renderGroups}
      </SidebarContent>

      {footer && <AdminSidebarFooter className="border-t">{footer}</AdminSidebarFooter>}
    </Sidebar>
  );
}

export const AdminSidebarHeader = React.memo(
  ({
    title = "Admin Panel",
    logo,
    subtitle,
    className,
    ...props
  }: {
    title?: string;
    logo?: React.ReactNode;
    subtitle?: string;
  } & React.HTMLAttributes<HTMLDivElement>) => {
    return (
      <div className={cn("flex items-center gap-3 py-3 bg-sidebar", className)} {...props}>
        {logo && <div className="shrink-0">{logo}</div>}
        <div className="flex flex-col min-w-0 flex-1">
          <h2 className="text-lg font-semibold tracking-tight truncate text-sidebar-foreground">
            {title}
          </h2>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>
      </div>
    );
  }
);

AdminSidebarHeader.displayName = "AdminSidebarHeader";

export const AdminSidebarFooter = React.memo(
  ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
      <div className={cn("px-2 py-2 bg-sidebar", className)} {...props}>
        {children}
      </div>
    );
  }
);

AdminSidebarFooter.displayName = "AdminSidebarFooter";
