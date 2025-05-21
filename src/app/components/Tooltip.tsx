"use client";

import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@utils/cn";

export interface TooltipProps extends TooltipPrimitive.TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: TooltipPrimitive.TooltipContentProps["side"];
  sideOffset?: TooltipPrimitive.TooltipContentProps["sideOffset"];
  className?: string;
  contentClassName?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = "top",
  sideOffset = 4,
  className,
  contentClassName,
  ...props
}) => {
  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root {...props}>
        <TooltipPrimitive.Trigger asChild className={cn(className)}>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={sideOffset}
            className={cn(
              "bg-background-overlay text-text-inverse animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs", // Use background-overlay and text-inverse
              contentClassName,
            )}
            // Ensure it's dismissible (Radix handles ESC, focus loss)
            // aria-describedby is handled by Radix
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-background-overlay" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export { Tooltip };
