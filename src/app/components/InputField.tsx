"use client";

import React, { forwardRef, useId } from "react";
import { cn } from "@utils/cn";
import { useTranslations } from "next-intl"; // Import useTranslations

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  panelClassName?: string;
  hint?: React.ReactElement;
  error?: string;
  success?: boolean;
  successMessage?: string; // Optional: for success state description
  hideLabel?: boolean; // Option to visually hide the label but keep it accessible
}

const InputField = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      panelClassName,
      hint,
      error,
      success,
      successMessage,
      id,
      hideLabel = false,
      required,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const successId = success ? `${inputId}-success` : undefined; // Optional: for success state description
    const t = useTranslations("Forms"); // Initialize translations

    const labelClasses = cn("block text-sm font-medium mb-1", {
      // Use text-body for label
      "sr-only": hideLabel, // Visually hide label if requested
    });

    const inputClasses = cn(
      "peer flex h-11 w-full rounded-md border border-border-divider bg-background-page px-3 py-2 text-base ring-offset-focus-indicator file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-indicator disabled:cursor-not-allowed disabled:text-disabled-control disabled:bg-disabled-bg", // Use design system colors, focus, disabled, size (h-11 for 44px)
      {
        "border-feedback-error focus-visible:outline-feedback-error": error, // Use feedback-error
        "border-feedback-success focus-visible:outline-feedback-success":
          success && !error, // Use feedback-success
      },
      className,
    );

    return (
      <div className={cn("relative w-full", panelClassName)}>
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && (
            <span className="text-feedback-error ml-1">
              {t("requiredIndicator")}
            </span>
          )}
          {/* Use translation key */}
        </label>
        <input
          type={type}
          id={inputId}
          className={inputClasses}
          ref={ref}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : success ? successId : undefined}
          {...props}
        />
        {/* Optional: Add custom hint icon if needed */}
        {hint &&
          React.cloneElement(hint, {
            "aria-label": label,
            className: cn("absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2", {
              "peer-focus:text-focus-indicator": !error && !success,
              "text-feedback-success": !error && success,
              "text-feedback-error": error && !success,
            }),
          } as React.DOMAttributes<Element>)}
        {error && (
          <p id={errorId} className="text-feedback-error mt-1 text-sm">
            {/* Use feedback-error */}
            {error}
          </p>
        )}
        {/* Optional: Add success message display if needed */}
        {successMessage && success && !error && (
          <p id={successId} className="text-feedback-success mt-1 text-sm">
            {/* Use feedback-success */}
            {successMessage}
          </p>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";

export { InputField };
