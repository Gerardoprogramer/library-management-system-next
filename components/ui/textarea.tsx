import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        [
          "min-h-24 w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5",
          "text-sm leading-6 text-foreground shadow-xs",
          "outline-none",
          "placeholder:text-muted-foreground",
          "selection:bg-primary selection:text-primary-foreground",
          "transition-[border-color,box-shadow,background-color,color]",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        ],
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
