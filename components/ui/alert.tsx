import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  [
    "relative grid w-full items-start",
    "rounded-xl border px-4 py-3.5 text-sm",
    "grid-cols-[0_1fr] gap-y-1",
    "has-[>svg]:grid-cols-[20px_1fr] has-[>svg]:gap-x-3",
    "[&>svg]:size-[18px] [&>svg]:translate-y-0.5 [&>svg]:text-current",
  ],
  {
    variants: {
      variant: {
        default: "border-border/70 bg-card text-card-foreground",

        destructive: "border-destructive/20 bg-destructive/8 text-destructive [&>svg]:text-destructive",

        warning: "border-primary/20 bg-primary/8 text-foreground [&>svg]:text-primary",

        muted: "border-border/60 bg-muted/50 text-foreground [&>svg]:text-muted-foreground",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 min-h-5 font-medium leading-5 tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("col-start-2 text-sm leading-6 text-muted-foreground [&_p]:leading-6", className)}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle, alertVariants };
