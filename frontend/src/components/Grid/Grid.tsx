import React from "react";

import type { GridProps } from "@/components/Grid/types";
import { cn } from "@/lib/utils";

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 lg:gap-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";

export default Grid;
