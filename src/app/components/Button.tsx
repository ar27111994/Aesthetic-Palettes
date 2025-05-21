"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-base font-semibold ring-offset-background-subtle motion-reduce:transition-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-indicator disabled:text-disabled-control disabled:bg-disabled-bg disabled:pointer-events-none truncate",
  {
    variants: {
      variant: {
        none: null,
        primary:
          "bg-primary-action text-background-page hover:bg-primary-action-hover", // Assuming white text on primary blue is accessible
        secondary: "bg-background-subtle hover:bg-border-divider", // Example hover, adjust as needed
        tertiary: "bg-accent text-background-page hover:bg-black/80", // Example hover, assuming white text, adjust as needed
        destructive: "bg-feedback-error text-background-page hover:bg-black/90", // Example hover, assuming white text, adjust as needed
        link: "text-primary-action underline-offset-4 hover:underline",
        ghost: "hover:bg-background-subtle hover:text-text-body",
        outline:
          "border border-border-divider bg-background-page hover:bg-background-subtle hover:text-text-body",
      },
      size: {
        default: "h-11 px-4 py-2", // Ensure min 44px height
        sm: "h-10 rounded-md px-3", // Ensure min 40px height (adjust if needed for consistency)
        lg: "h-12 rounded-md px-8", // Ensure min 48px height
        icon: "h-11 w-11", // Ensure min 44px size
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
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, isLoading = false, children, ...props },
    ref,
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="mr-3 -ml-1 h-5 w-5 animate-spin text-current" // Use currentColor
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
