"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function TooltipProvider({
  delayDuration = 250,
  skipDelayDuration = 100,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  );
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          [
            "z-50 w-fit max-w-72",
            "rounded-lg border border-border/70",
            "bg-popover px-3 py-2 text-popover-foreground shadow-lg",
            "text-xs leading-5 text-balance",
            "origin-(--radix-tooltip-content-transform-origin)",
            "data-[state=delayed-open]:animate-in",
            "data-[state=closed]:animate-out",
            "data-[state=delayed-open]:fade-in-0",
            "data-[state=closed]:fade-out-0",
            "data-[state=delayed-open]:zoom-in-95",
            "data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-1",
            "data-[side=left]:slide-in-from-right-1",
            "data-[side=right]:slide-in-from-left-1",
            "data-[side=top]:slide-in-from-bottom-1",
          ],
          className
        )}
        {...props}
      >
        {children}

        <TooltipPrimitive.Arrow className="z-50 size-2.5 rotate-45 border-r border-b border-border/70 bg-popover fill-popover" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
