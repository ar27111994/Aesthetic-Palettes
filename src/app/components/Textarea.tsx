"use client";

import React, { forwardRef, useEffect, useRef } from "react";
import { useTranslations } from "next-intl"; // Import useTranslations
import { cn } from "@utils/cn";
import { AriaTextFieldOptions, useTextField } from "react-aria";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  description?: string; // Added to align with useTextField, can be used for general descriptions or success messages
  error?: string;
  success?: boolean; // Kept for controlling success state styling
  successMessage?: string; // Kept for displaying success message
  hideLabel?: boolean; // Option to visually hide the label but keep it accessible
  autoResize?: boolean; // Option for auto-resizing height
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      description: descriptionProp, // Renamed to avoid conflict with useTextField's description
      error,
      success,
      successMessage,
      id: providedId,
      hideLabel = false,
      required,
      autoResize = false,
      ...props
    },
    forwardedRef,
  ) => {
    const t = useTranslations("Forms"); // Initialize translations
    const localRef = useRef<HTMLTextAreaElement>(null);

    // Combine forwardedRef and localRef if necessary, or just use localRef for useTextField
    // For simplicity, react-aria's useTextField expects a ref directly.
    // If the parent needs the ref, more complex ref merging or useImperativeHandle would be needed.
    // Here, we prioritize useTextField's needs for the ref.

    const { validationState, errorMessage, description } = (() => {
      if (error) {
        return {
          validationState: "invalid" as const,
          errorMessage: error,
          description: descriptionProp,
        };
      } else if (success && successMessage) {
        return {
          validationState: "valid" as const,
          description: successMessage,
          errorMessage: undefined,
        };
      } else if (success) {
        return {
          validationState: "valid" as const,
          description: descriptionProp,
          errorMessage: undefined,
        };
      }
      return {
        validationState: undefined,
        description: descriptionProp,
        errorMessage: undefined,
      };
    })();

    let { labelProps, inputProps, descriptionProps, errorMessageProps } =
      useTextField(
        {
          ...props, // Pass through other props like placeholder, name, etc.
          id: providedId,
          label,
          description,
          errorMessage,
          validationState,
          inputElementType: "textarea",
          isRequired: required,
          // value, defaultValue, onChange etc. are passed via ...props
        } as AriaTextFieldOptions<"textarea">,
        localRef, // Pass the ref to useTextField
      );

    // If a forwardedRef exists, assign the localRef's current value to it.
    // This is a common pattern if the parent needs access to the DOM element.
    useEffect(() => {
      if (forwardedRef) {
        if (typeof forwardedRef === "function") {
          forwardedRef(localRef.current);
        } else {
          forwardedRef.current = localRef.current;
        }
      }
    }, [forwardedRef]);

    const labelClasses = cn(
      "block text-sm font-medium mb-1", // Use text-body
      {
        "sr-only": hideLabel,
      },
    );

    const textareaClasses = cn(
      "flex min-h-[80px] w-full rounded-md border border-border-divider bg-background-page px-3 py-2 text-sm ring-offset-background-page placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-indicator focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-disabled-bg disabled:text-disabled-control", // Use design system tokens
      {
        "border-feedback-error focus-visible:ring-feedback-error": error, // Use feedback-error
        "border-feedback-success focus-visible:ring-feedback-success":
          success && !error, // Use feedback-success
        "resize-none": !autoResize,
      },
      className,
    );

    const resize = (el: HTMLTextAreaElement) => {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    };

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) resize(event.target);
      // Call onChange from inputProps if it exists (handled by useTextField)
      if (inputProps.onChange) {
        inputProps.onChange(event as any); // react-aria's onChange might have a different signature
      }
      // Call original onInput from props if it was passed
      if (props.onInput) {
        props.onInput(event);
      }
    };

    // keep in sync when value is controlled
    useEffect(() => {
      if (autoResize && localRef.current) {
        resize(localRef.current);
      }
    }, [autoResize, props.value]);

    return (
      <div className="w-full">
        <label {...labelProps} className={labelClasses}>
          {label}
          {required && (
            <span className="text-feedback-error ml-1">
              {t("requiredIndicator")}
            </span>
          )}
        </label>
        <textarea
          {...inputProps} // Includes id, aria-invalid, aria-describedby, etc.
          ref={localRef} // Assign the ref here
          required={required} // Still useful for native browser validation indication
          className={textareaClasses}
          onInput={handleInput} // Use onInput for auto-resize and pass to original onInput
          // onChange is now handled by inputProps.onChange, but we call it in handleInput
          // To ensure autoResize works with controlled components, we might need to adjust how onChange is handled
          // For now, assuming props.onChange (if any) is for the original component's API
        />
        {error && (
          <p
            {...errorMessageProps}
            className="text-feedback-error mt-1 text-sm"
          >
            {/* Use feedback-error */}
            {error}
          </p>
        )}
        {successMessage && success && !error && (
          <p
            {...descriptionProps}
            className="text-feedback-success mt-1 text-sm"
          >
            {/* Use feedback-success */}
            {successMessage}
          </p>
        )}
        {/* General description if provided and no success message is shown */}
        {descriptionProp && !(successMessage && success && !error) && (
          <p {...descriptionProps} className="text-text-secondary mt-1 text-sm">
            {descriptionProp}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
