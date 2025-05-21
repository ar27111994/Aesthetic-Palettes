"use client";

import React, { forwardRef, useId } from "react";
import { cn } from "@utils/cn";
import { useTranslations } from "next-intl"; // Import useTranslations

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  hideLabel?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, label, error, id, hideLabel = false, required, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const errorId = error ? `${checkboxId}-error` : undefined;
    const t = useTranslations("Forms"); // Initialize translations for a common 'Forms' namespace

    const labelClasses = cn("text-sm font-medium", {
      // Use text-body
      "sr-only": hideLabel,
    });

    const checkboxClasses = cn(
      "h-4 w-4 rounded border-border-divider text-primary-action focus:ring-focus-indicator focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50", // Use design system colors and focus
      {
        "border-feedback-error focus:ring-feedback-error": error, // Use feedback-error
      },
      // Note: Tailwind Forms plugin might provide default styles, adjust as needed
    );

    return (
      <div className={cn("flex items-center", className)}>
        <input
          type="checkbox"
          id={checkboxId}
          ref={ref}
          required={required}
          className={checkboxClasses}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...props}
        />
        <label htmlFor={checkboxId} className={cn("ml-2", labelClasses)}>
          {label}
          {required && (
            <span className="text-feedback-error ml-1">
              {t("requiredIndicator")}
            </span>
          )}
          {/* Use translation key */}
        </label>
        {error && (
          // Display error inline or associate via aria-describedby if placed elsewhere
          <p id={errorId} className="text-feedback-error ml-2 text-sm">
            {/* Use feedback-error */}
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
