"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";

import type { CardHelperProps } from "./types";

export const CardWithProps = ({
  className,
  cardTitle,
  cardDescription,
  cardFooter,
  cardAction,
  children,
  ...props
}: CardHelperProps) => {
  return (
    <Card className={className} {...props}>
      {(cardTitle || cardDescription) && (
        <CardHeader>
          {cardTitle && <CardTitle>{cardTitle}</CardTitle>}
          {cardDescription && <CardDescription>{cardDescription}</CardDescription>}
        </CardHeader>
      )}

      {children && <CardContent>{children}</CardContent>}

      {cardFooter && <CardFooter>{cardFooter}</CardFooter>}

      {cardAction && <CardAction>{cardAction}</CardAction>}
    </Card>
  );
};

export default CardWithProps;
