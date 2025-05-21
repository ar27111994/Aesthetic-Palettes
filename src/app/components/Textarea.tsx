"use client";

import React, { forwardRef, useId } from "react";
import { useTranslations } from "next-intl"; // Import useTranslations
import { cn } from "@utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  success?: boolean;
  successMessage?: string;
  hideLabel?: boolean; // Option to visually hide the label but keep it accessible
  autoResize?: boolean; // Option for auto-resizing height
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      success,
      successMessage,
      id,
      hideLabel = false,
      required,
      autoResize = false,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = error ? `${textareaId}-error` : undefined;
    const successId = success ? `${textareaId}-success` : undefined;
    const t = useTranslations("Forms"); // Initialize translations

    const labelClasses = cn(
      "block text-sm font-medium mb-1", // Use text-body
      {
        "sr-only": hideLabel,
      },
    );

    const textareaClasses = cn(
      "flex min-h-[80px] w-full rounded-md border border-border-divider bg-background-page px-3 py-2 text-sm  ring-offset-background-page placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-indicator focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-disabled-bg disabled:text-disabled-control", // Use design system tokens
      {
        "border-feedback-error focus-visible:ring-feedback-error": error, // Use feedback-error
        "border-feedback-success focus-visible:ring-feedback-success":
          success && !error, // Use feedback-success
        "resize-none": !autoResize,
      },
      className,
    );

    // Basic auto-resize logic (can be enhanced with a library or more complex JS)
    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        event.target.style.height = "auto";
        event.target.style.height = `${event.target.scrollHeight}px`;
      }
      if (props.onInput) {
        props.onInput(event);
      }
    };

    return (
      <div className="w-full">
        <label htmlFor={textareaId} className={labelClasses}>
          {label}
          {required && (
            <span className="text-feedback-error ml-1">
              {t("requiredIndicator")}
            </span>
          )}
          {/* Use feedback-error */}
        </label>
        <textarea
          id={textareaId}
          className={textareaClasses}
          ref={ref}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : success ? successId : undefined}
          onInput={handleInput} // Use onInput for auto-resize
          {...props}
        />
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

Textarea.displayName = "Textarea";

export { Textarea };
