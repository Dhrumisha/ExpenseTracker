"use client";

import React from "react";

import { useRouter } from "next/navigation";

import {
  Search,
  Bell,
  HelpCircle,
  Menu,
  X,
  BadgeCheck,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";

import { ROUTES } from "@/admin-pages/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch, logout, clearUser } from "@/redux/index";
import { navigationActions } from "@/redux/slice/navigationSlice";

import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

export const AdminHeader: React.FC = () => {
  const { toggleSidebar, openMobile } = useSidebar();
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get display name with fallbacks
  const displayName =
    user.display_name ||
    user.full_name ||
    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
    user.user_name;

  // Get user email or fallback
  const userEmail = user.email || "";

  const handleLogout = () => {
    // Dispatch logout action (clears cookies and sessionStorage)
    dispatch(logout());
    // Clear user data from Redux
    dispatch(clearUser());
    // Clear sidebar items from Redux
    dispatch(navigationActions.clearSidebarItems());
    // Redirect to login page
    router.push(ROUTES.auth.login);
  };

  return (
    <header
      className={`sticky top-0 w-full border-b bg-background ${openMobile ? "z-50" : "z-40"}`}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Side - Menu Button (Mobile) + Logo and Title */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              toggleSidebar();
            }}
            className="md:hidden relative z-50 pointer-events-auto"
          >
            {openMobile ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </Button>

          <div className="flex items-center justify-center">
            <div className="w-18 h-18 main-logo"></div>
            {/* </span> */}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs md:text-sm font-semibold text-foreground">
              Admin Control Panel
            </h1>
            <p className="hidden sm:block text-xs text-muted-foreground">B2B Ecommerce Platform</p>
          </div>
        </div>

        {/* Right Side - Search, Icons, and User */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Bar - Hidden on small screens */}
          {/* <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-5 h-5 w-5 -translate-y-1/2 text-muted-foreground lg:hidden" />
            <InputWithProps placeholder="Search..." />
          </div> */}

          {/* Search Icon for mobile */}
          {/* <button className="lg:hidden rounded-full p-2 hover:bg-accent transition-colors">
            <Search className="h-5 w-5 text-muted-foreground" />
          </button> */}

          {/* Notification Bell */}
          <button className="relative rounded-full p-2 hover:bg-accent transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive"></span>
          </button>

          {/* Help Icon - Hidden on small screens */}
          <button className="hidden md:block rounded-full p-2 hover:bg-accent transition-colors">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted overflow-hidden">
                  {user.user_profile_pic ? (
                    <img
                      src={user.user_profile_pic}
                      alt="User Profile"
                      className="w-full h-full object-fit"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-lg font-semibold">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="hidden md:flex flex-col items-start text-left">
                  <span className="text-sm font-medium text-foreground">{displayName}</span>
                  {userEmail && (
                    <span className="text-xs text-muted-foreground truncate max-w-40">
                      {userEmail}
                    </span>
                  )}
                </div>
                <ChevronsUpDown className="hidden md:block ml-1 h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-lg text-foreground bg-background" align="end" sideOffset={4}>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push(ROUTES.admin.profile)}>
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem> */}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
