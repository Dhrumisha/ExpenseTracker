// src/components/common/CommonDropdown/index.tsx

"use client";

import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * Dropdown Menu Item Types
 */
export interface DropdownItemBase {
  id: string;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  shortcut?: string;
}

export interface DropdownActionItem extends DropdownItemBase {
  type?: "item";
  onClick?: () => void;
}

export interface DropdownCheckboxItem extends DropdownItemBase {
  type: "checkbox";
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface DropdownRadioItem extends Omit<DropdownItemBase, "id"> {
  value: string;
}

export interface DropdownRadioGroup {
  type: "radio";
  id: string;
  label?: string;
  value: string;
  items: DropdownRadioItem[];
  onValueChange?: (value: string) => void;
}

export interface DropdownSubMenu extends DropdownItemBase {
  type: "submenu";
  items: DropdownMenuItem[];
}

export interface DropdownSeparator {
  type: "separator";
  id: string;
}

export interface DropdownLabel {
  type: "label";
  id: string;
  label: string;
}

export type DropdownMenuItem =
  | DropdownActionItem
  | DropdownCheckboxItem
  | DropdownRadioGroup
  | DropdownSubMenu
  | DropdownSeparator
  | DropdownLabel;

/**
 * CommonDropdown Props
 */
export interface DropdownWithProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  className?: string;
  contentClassName?: string;
  onOpenChange?: (open: boolean) => void;
}

/**
 * CommonDropdown Component
 *
 * A reusable dropdown menu component that wraps ShadCN DropdownMenu
 * Supports various item types, icons, shortcuts, and nested menus
 *
 * @example
 * // Basic dropdown
 * <CommonDropdown
 *   trigger={<Button>Open Menu</Button>}
 *   items={[
 *     { id: "1", label: "Profile", icon: <User />, onClick: () => {} },
 *     { type: "separator", id: "s1" },
 *     { id: "2", label: "Logout", icon: <LogOut />, onClick: () => {} }
 *   ]}
 * />
 *
 * @example
 * // With checkboxes
 * <CommonDropdown
 *   trigger={<Button>Filters</Button>}
 *   items={[
 *     {
 *       type: "checkbox",
 *       id: "1",
 *       label: "Show completed",
 *       checked: true,
 *       onCheckedChange: (checked) => {}
 *     }
 *   ]}
 * />
 */
export const CommonDropdown: React.FC<DropdownWithProps> = ({
  trigger,
  items,
  align = "start",
  side = "bottom",
  sideOffset = 4,
  className,
  contentClassName,
  onOpenChange,
}) => {
  const renderItem = (item: DropdownMenuItem) => {
    // Separator
    if (item.type === "separator") {
      return <DropdownMenuSeparator key={item.id} />;
    }

    // Label
    if (item.type === "label") {
      return <DropdownMenuLabel key={item.id}>{item.label}</DropdownMenuLabel>;
    }

    // Checkbox Item
    if (item.type === "checkbox") {
      return (
        <DropdownMenuCheckboxItem
          key={item.id}
          checked={item.checked}
          onCheckedChange={item.onCheckedChange}
          disabled={item.disabled}
          className={cn(item.destructive && "text-destructive focus:text-destructive")}
        >
          {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
          {item.label}
          {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
        </DropdownMenuCheckboxItem>
      );
    }

    // Radio Group
    if (item.type === "radio") {
      return (
        <DropdownMenuGroup key={item.id}>
          {item.label && <DropdownMenuLabel>{item.label}</DropdownMenuLabel>}
          <DropdownMenuRadioGroup value={item.value} onValueChange={item.onValueChange}>
            {item.items.map((radioItem) => (
              <DropdownMenuRadioItem
                key={radioItem.value}
                value={radioItem.value}
                disabled={radioItem.disabled}
                className={cn(radioItem.destructive && "text-destructive focus:text-destructive")}
              >
                {radioItem.icon && <span className="mr-2 h-4 w-4">{radioItem.icon}</span>}
                {radioItem.label}
                {radioItem.shortcut && (
                  <DropdownMenuShortcut>{radioItem.shortcut}</DropdownMenuShortcut>
                )}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      );
    }

    // Submenu
    if (item.type === "submenu") {
      return (
        <DropdownMenuSub key={item.id}>
          <DropdownMenuSubTrigger disabled={item.disabled}>
            {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
            {item.label}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {item.items.map((subItem) => renderItem(subItem))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }

    // Regular Action Item
    return (
      <DropdownMenuItem
        key={item.id}
        onClick={item.onClick}
        disabled={item.disabled}
        className={cn(item.destructive && "text-destructive focus:text-destructive")}
      >
        {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
        {item.label}
        {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
      </DropdownMenuItem>
    );
  };

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild className={className}>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn("min-w-[200px]", contentClassName)}
      >
        {items.map((item) => renderItem(item))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CommonDropdown;
