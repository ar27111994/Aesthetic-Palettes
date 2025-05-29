"use client";

import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@utils/cn";

export interface TooltipProps extends TooltipPrimitive.TooltipProps {
  /** The content to display inside the tooltip. Keep it concise and informative. */
  content: React.ReactNode;
  /** The trigger element for the tooltip. Ensure this element is accessible and ideally descriptive on its own, especially for SEO and non-JS scenarios. */
  children: React.ReactNode;
  side?: TooltipPrimitive.TooltipContentProps["side"];
  sideOffset?: TooltipPrimitive.TooltipContentProps["sideOffset"];
  className?: string;
  /** Additional CSS classes for the tooltip's content panel. */
  contentClassName?: string;
  // Consider mobile/touch interactions: Radix tooltips often trigger on long-press.
  // Ensure the trigger element is easily discoverable and usable on touch devices.
  // Test thoroughly on various screen sizes and input methods.
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
              // ACCESSIBILITY & THEMING: CRITICAL - Verify WCAG contrast.
              // Ensure 'bg-background-overlay' and 'text-text-inverse' provide sufficient (AA, preferably AAA) contrast ratio.
              // This is vital for readability, especially with 'text-xs'.
              "bg-background-subtle text-text-body border-border-divider animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md border-2 px-3 py-1.5 text-xs font-medium", // Use background-overlay and text-inverse
              contentClassName,
            )}
            // Ensure it's dismissible (Radix handles ESC, focus loss, click outside)
            // aria-describedby is automatically handled by Radix UI to link trigger and content
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-border-strong" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export { Tooltip };
