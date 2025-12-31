"use client";

import * as React from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "../Header/AdminHeader";

export interface SidebarLayoutProps {
  children: React.ReactNode;
  sidebarTitle?: string;
  sidebarSubtitle?: string;
  sidebarLogo?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  groupLabel?: string;
  defaultOpenItems?: string[];
  breadcrumbItems?: Array<{
    label: string;
    href?: string;
    isCurrentPage?: boolean;
  }>;
  headerClassName?: string;
  className?: string;
  showHeader?: boolean;
}

export function MainSidebar({ children, className = "" }: SidebarLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full">
        <AdminHeader />

        <div className="flex flex-1 overflow-hidden ">
          <AdminSidebar collapsible="icon" />
          <SidebarInset className="flex flex-col flex-1 w-full">
            <main
              className={`flex-1 overflow-auto bg-gray-50 pl-0 md:pl-70 xl:pl-72 w-full ${className}`}
            >
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
