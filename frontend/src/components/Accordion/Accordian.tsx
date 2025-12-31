// src/components/common/CommonAccordion/index.tsx

"use client";

import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

/**
 * Accordion Item Interface
 */
export interface AccordionItemData {
  id: string;
  title: string | React.ReactNode;
  content: string | React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

/**
 * CommonAccordion Props
 */
export interface AccordionWithPropsProps {
  items: AccordionItemData[];
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  className?: string;
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  orientation?: "vertical" | "horizontal";
  onValueChange?: (value: string | string[]) => void;
}

/**
 * CommonAccordion Component
 *
 * A reusable accordion component that wraps ShadCN Accordion
 * Supports single or multiple open items
 *
 * @example
 * // Single selection
 * <CommonAccordion
 *   type="single"
 *   collapsible
 *   items={[
 *     { id: "1", title: "Title 1", content: "Content 1" },
 *     { id: "2", title: "Title 2", content: "Content 2" }
 *   ]}
 * />
 *
 * @example
 * // Multiple selection
 * <CommonAccordion
 *   type="multiple"
 *   defaultValue={["item-1", "item-2"]}
 *   items={accordionItems}
 * />
 */
export const AccordionWithProps: React.FC<AccordionWithPropsProps> = ({
  items,
  type = "single",
  collapsible = true,
  defaultValue,
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
  onValueChange,
}) => {
  return (
    <Accordion
      type={type as any}
      collapsible={type === "single" ? collapsible : undefined}
      defaultValue={defaultValue as any}
      className={cn("w-full", className)}
      onValueChange={onValueChange as any}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className={cn(itemClassName)}
          disabled={item.disabled}
        >
          <AccordionTrigger
            className={cn(
              "hover:no-underline",
              item.disabled && "opacity-50 cursor-not-allowed",
              triggerClassName
            )}
          >
            <div className="flex items-center gap-2 w-full">
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span className="flex-1 text-left">{item.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className={cn("text-sm", contentClassName)}>
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionWithProps;
