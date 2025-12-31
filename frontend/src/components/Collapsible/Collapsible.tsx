// src/components/common/CommonCollapsible/index.tsx

"use client";

import React, { useState } from "react";

import { ChevronDown, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

/**
 * CommonCollapsible Props
 */
export interface CollapsibleWithProps {
  trigger: string | React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  icon?: "chevron-down" | "chevron-right" | React.ReactNode;
  iconPosition?: "left" | "right";
  bordered?: boolean;
  rounded?: boolean;
  animated?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * CommonCollapsible Component
 *
 * A reusable collapsible component that wraps ShadCN Collapsible
 * Supports custom triggers, icons, and styling
 *
 * @example
 * // Basic usage
 * <CommonCollapsible trigger="Show More">
 *   <p>Hidden content here...</p>
 * </CommonCollapsible>
 *
 * @example
 * // Custom trigger with border
 * <CommonCollapsible
 *   trigger={<div>Custom Trigger</div>}
 *   bordered
 *   rounded
 *   icon="chevron-right"
 * >
 *   <div>Content</div>
 * </CommonCollapsible>
 */
export const CommonCollapsible: React.FC<CollapsibleWithProps> = ({
  trigger,
  children,
  defaultOpen = false,
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  icon = "chevron-down",
  iconPosition = "left",
  bordered = false,
  rounded = false,
  animated = true,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  // Render icon based on type
  const renderIcon = async () => {
    if (typeof icon === "string") {
      const IconComponent = icon === "chevron-down" ? ChevronDown : ChevronRight;
      return (
        <IconComponent
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            animated && icon === "chevron-down" && isOpen && "rotate-180",
            animated && icon === "chevron-right" && isOpen && "rotate-90"
          )}
        />
      );
    }
    return icon;
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={handleOpenChange}
      disabled={disabled}
      className={cn("w-full", bordered && "border rounded-lg", className)}
    >
      <CollapsibleTrigger asChild disabled={disabled}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between p-4 hover:no-underline",
            disabled && "opacity-50 cursor-not-allowed",
            bordered && rounded && "rounded-t-lg",
            triggerClassName
          )}
        >
          <div className="flex items-center gap-2 flex-1">
            {icon && iconPosition === "left" && (
              <span className="flex-shrink-0">{renderIcon()}</span>
            )}
            <span className="flex-1 text-left font-medium">{trigger}</span>
            {icon && iconPosition === "right" && (
              <span className="flex-shrink-0">{renderIcon()}</span>
            )}
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn(
          "overflow-hidden",
          animated &&
            "transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
          contentClassName
        )}
      >
        <div className={cn("p-4 pt-0", bordered && "border-t")}>{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

/**
 * CommonCollapsibleGroup Component
 *
 * Displays multiple collapsibles in a group
 */
export interface CollapsibleItem {
  id: string;
  trigger: string | React.ReactNode;
  content: React.ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
}

export interface CollapsibleGroupWithProps {
  items: CollapsibleItem[];
  accordion?: boolean; // Only one can be open at a time
  className?: string;
  itemClassName?: string;
  bordered?: boolean;
  rounded?: boolean;
}

export const CommonCollapsibleGroup: React.FC<CollapsibleGroupWithProps> = ({
  items,
  accordion = false,
  className,
  itemClassName,
  bordered = true,
  rounded = true,
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(items.filter((item) => item.defaultOpen).map((item) => item.id))
  );

  const handleOpenChange = (id: string, open: boolean) => {
    if (accordion && open) {
      // Close all others in accordion mode
      setOpenItems(new Set([id]));
    } else {
      const newOpenItems = new Set(openItems);
      if (open) {
        newOpenItems.add(id);
      } else {
        newOpenItems.delete(id);
      }
      setOpenItems(newOpenItems);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => (
        <CommonCollapsible
          key={item.id}
          trigger={item.trigger}
          defaultOpen={openItems.has(item.id)}
          disabled={item.disabled}
          bordered={bordered}
          rounded={rounded}
          className={itemClassName}
          onOpenChange={(open) => handleOpenChange(item.id, open)}
        >
          {item.content}
        </CommonCollapsible>
      ))}
    </div>
  );
};

export default CommonCollapsible;
