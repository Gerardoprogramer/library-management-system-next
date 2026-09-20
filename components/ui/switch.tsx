"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        [
          "group/switch peer inline-flex shrink-0 items-center",
          "rounded-full border border-transparent",
          "bg-input shadow-xs",
          "outline-none",
          "transition-[background-color,border-color,box-shadow]",
          "data-[state=checked]:bg-primary",
          "focus-visible:ring-2 focus-visible:ring-ring/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[size=default]:h-5 data-[size=default]:w-9",
          "data-[size=sm]:h-4 data-[size=sm]:w-7",
        ],
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn([
          "pointer-events-none block rounded-full bg-background shadow-sm",
          "transition-transform",
          "group-data-[size=default]/switch:size-4",
          "group-data-[size=sm]/switch:size-3",
          "data-[state=unchecked]:translate-x-0.5",
          "data-[state=checked]:translate-x-[calc(100%+2px)]",
        ])}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
