import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1",
    "whitespace-nowrap rounded-full border px-2.5 py-1",
    "text-xs font-medium leading-none",
    "transition-[background-color,border-color,color,box-shadow]",
    "overflow-hidden",
    "[&>svg]:pointer-events-none [&>svg]:size-3.5 [&>svg]:shrink-0",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
    "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
  ],
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-primary/10 text-primary [a&]:hover:bg-primary/15",

        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80",

        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive [a&]:hover:bg-destructive/15 focus-visible:ring-destructive/30",

        outline: "border-border bg-background text-foreground [a&]:hover:bg-muted",

        ghost: "border-transparent bg-transparent text-muted-foreground [a&]:hover:bg-muted [a&]:hover:text-foreground",

        link: "border-transparent bg-transparent p-0 text-primary underline-offset-4 [a&]:hover:underline",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp data-slot="badge" data-variant={variant} className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
