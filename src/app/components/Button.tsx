"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@utils/cn";
import { Tooltip } from "@components/Tooltip"; // Assuming Tooltip component is in @components

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-base font-semibold ring-offset-background-subtle motion-reduce:transition-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-indicator disabled:text-disabled-control disabled:bg-disabled-bg disabled:pointer-events-none truncate",
  {
    variants: {
      variant: {
        none: null,
        primary:
          "bg-primary-action text-background-page hover:bg-primary-action-hover", // WCAG AA: Ensure contrast ratio is at least 4.5:1 for normal text and 3:1 for large text.
        secondary: "bg-background-subtle hover:bg-border-divider", // WCAG AA: Ensure contrast ratio.
        tertiary: "bg-accent text-background-page hover:bg-black/80", // WCAG AA: Ensure contrast ratio.
        destructive: "bg-feedback-error text-background-page hover:bg-black/90", // WCAG AA: Ensure contrast ratio.
        link: "text-primary-action underline-offset-4 hover:underline", // WCAG AA: Ensure contrast ratio.
        ghost: "hover:bg-background-subtle hover:text-text-body", // WCAG AA: Ensure contrast ratio.
        outline:
          "border border-border-divider bg-background-page hover:bg-background-subtle hover:text-text-body", // WCAG AA: Ensure contrast ratio.
      },
      size: {
        default: "h-11 px-4 py-2", // Ensure min 44px height for touch targets (WCAG 2.5.5 Target Size).
        sm: "h-10 rounded-md px-3", // Ensure min 40px height (adjust if needed for consistency).
        lg: "h-12 rounded-md px-8", // Ensure min 48px height.
        icon: "h-11 w-11", // Ensure min 44px size for touch targets.
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * If `true`, the button will show a loading spinner.
   */
  isLoading?: boolean;
  /**
   * Optional content to display in a tooltip on hover/focus.
   */
  tooltipContent?: React.ReactNode;
  /**
   * Optional side for the tooltip to appear on.
   * @default 'top'
   */
  tooltipSide?: "top" | "right" | "bottom" | "left";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      children,
      tooltipContent,
      tooltipSide,
      ...props
    },
    ref,
  ) => {
    const buttonElement = (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        aria-busy={isLoading} // Accessibility: Indicates the button is busy.
        // SEO: Buttons are generally not primary SEO content, but ensure text content is descriptive.
        // Next.js PPR: This component is client-side due to interactivity (isLoading, onClick). PPR benefits are limited here unless parts can be server-rendered.
        {...props}
      >
        {isLoading ? (
          // Performance: SVG is inline, consider optimizing if many buttons are rendered.
          <svg
            className="mr-3 -ml-1 h-5 w-5 animate-spin text-current" // Use currentColor for theming
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true" // Accessibility: Hide decorative SVG from screen readers.
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : null}
        {children}
      </button>
    );

    // Accessibility: Provide tooltips for clarity, especially for icon buttons or truncated text.
    // Keyboard Navigation: Handled by native button element (Enter/Space for activation).
    // Toasts: For feedback on actions, use react-hot-toast externally when this button's action completes.
    if (tooltipContent) {
      return (
        <Tooltip content={tooltipContent} side={tooltipSide}>
          {buttonElement}
        </Tooltip>
      );
    }

    return buttonElement;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
