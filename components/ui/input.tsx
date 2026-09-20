import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        [
          "h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3",
          "text-sm text-foreground shadow-xs",
          "outline-none",
          "placeholder:text-muted-foreground",
          "selection:bg-primary selection:text-primary-foreground",
          "transition-[border-color,box-shadow,background-color,color]",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
          "file:mr-3 file:inline-flex file:h-7 file:border-0 file:bg-transparent",
          "file:text-sm file:font-medium file:text-foreground",
        ],
        className
      )}
      {...props}
    />
  );
}

export { Input };
