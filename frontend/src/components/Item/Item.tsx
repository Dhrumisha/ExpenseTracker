import * as React from "react";

import {
  Item as ShadCNItem,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemMedia,
  ItemActions,
  ItemGroup,
} from "@/components/ui/item";

import type {
  ItemHelperProps,
  ItemContentHelperProps,
  ItemTitleHelperProps,
  ItemDescriptionHelperProps,
  ItemMediaHelperProps,
  ItemActionsHelperProps,
} from "./types";
export const ItemWithProps = ({
  children,
  variant = "default",
  size = "default",
  className,
  ...props
}: ItemHelperProps) => {
  return (
    <ShadCNItem variant={variant} size={size} className={className} {...props}>
      {children}
    </ShadCNItem>
  );
};

export const ItemContentWithProps = ({ children, className, ...props }: ItemContentHelperProps) => {
  return (
    <ItemContent className={className} {...props}>
      {children}
    </ItemContent>
  );
};

export const ItemTitleWithProps = ({ children, className, ...props }: ItemTitleHelperProps) => {
  return (
    <ItemTitle className={className} {...props}>
      {children}
    </ItemTitle>
  );
};

export const ItemDescriptionWithProps = ({
  children,
  className,
  ...props
}: ItemDescriptionHelperProps) => {
  return (
    <ItemDescription className={className} {...props}>
      {children}
    </ItemDescription>
  );
};

export const ItemMediaWithProps = ({
  children,
  variant = "default",
  className,
  ...props
}: ItemMediaHelperProps) => {
  return (
    <ItemMedia variant={variant} className={className} {...props}>
      {children}
    </ItemMedia>
  );
};

export const ItemActionsWithProps = ({ children, className, ...props }: ItemActionsHelperProps) => {
  return (
    <ItemActions className={className} {...props}>
      {children}
    </ItemActions>
  );
};

export const ItemGroupWithProps = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <ItemGroup ref={ref} className={className} {...props}>
      {children}
    </ItemGroup>
  );
});

export default ItemWithProps;
