"use client";

import React, { forwardRef, useId, useRef } from "react";
import { cn } from "@utils/cn";
import { useTranslations } from "next-intl";
import { useCheckbox } from "@react-aria/checkbox";
import { useToggleState } from "@react-stately/toggle";
import { AriaCheckboxProps } from "@react-types/checkbox"; // For better type safety with react-aria

export interface CheckboxProps extends AriaCheckboxProps {
  // Extends AriaCheckboxProps for compatibility with useCheckbox
  // Omit React.InputHTMLAttributes<HTMLInputElement>'s 'type' as it's handled
  label: string;
  error?: string;
  hideLabel?: boolean;
  className?: string; // Ensure className is part of the props
  // `required` is part of AriaCheckboxProps as `isRequired`
}

/**
 * Checkbox component enhanced with React Aria for accessibility and state management.
 *
 * Adheres to best practices for:
 * - Mobile-First Responsive Design: Styling is managed via Tailwind CSS, ensure touch targets are adequate.
 * - SEO: Not directly applicable, but associated label text should be meaningful.
 * - Accessibility (WCAG AA & AAA):
 *   - Leverages `react-aria` for keyboard navigation (Space to toggle) and ARIA attributes.
 *   - `aria-invalid` and `aria-describedby` are used for error states.
 *   - Ensure `label` prop provides a clear, visible label. `hideLabel` uses `sr-only` for accessibility.
 *   - WCAG Contrast: Colors (`text-primary-action`, `border-border-divider`, `focus:ring-focus-indicator`, `text-feedback-error`) should be verified to meet AA/AAA contrast ratios.
 * - Performance Optimization: Uses `forwardRef`. Consider `React.memo` if re-renders are frequent.
 * - Next.js PPR: As a client component (`"use client"`), it integrates well with PPR environments.
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, label, error, id, hideLabel = false, ...props }, // `required` is handled by `isRequired` in props for useCheckbox
    ref,
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const errorId = error ? `${checkboxId}-error` : undefined;
    const t = useTranslations("Forms");

    // Use a local ref for react-aria if an external ref is not provided
    const localRef = useRef<HTMLInputElement>(null);
    const inputRef = ref || localRef;

    // React Aria state and checkbox hooks
    // Pass all props to useToggleState and useCheckbox, including `isRequired` if needed.
    const state = useToggleState(props);
    const { inputProps } = useCheckbox(
      props,
      state,
      inputRef as React.RefObject<HTMLInputElement>,
    ); // Cast ref type

    const labelClasses = cn("text-sm font-medium select-none", {
      // `select-none` to prevent text selection on click
      "sr-only": hideLabel,
      // Consider text color for disabled state if needed
    });

    const checkboxClasses = cn(
      "h-4 w-4 rounded border-border-divider text-primary-action focus:ring-focus-indicator focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      {
        "border-feedback-error focus:ring-feedback-error": error,
      },
    );

    // The main container can be a label itself to make the whole area clickable
    // or ensure the <label> element correctly points to the input via htmlFor.
    // React Aria's inputProps often handle the necessary event wiring.

    return (
      <div className={cn("flex flex-col", className)}>
        {/* Changed to flex-col for error message positioning */}
        <label className="flex items-center">
          <input
            {...inputProps} // Spread inputProps from useCheckbox
            id={checkboxId} // Ensure ID is applied for label association if not handled by inputProps
            ref={inputRef}
            className={checkboxClasses}
            aria-invalid={!!error || inputProps["aria-invalid"]} // Combine error state
            aria-describedby={errorId || inputProps["aria-describedby"]}
            // `required` is handled by `isRequired` in inputProps
          />
          <span className={cn("ml-2", labelClasses)}>
            {label}
            {props.isRequired && (
              <span className="text-feedback-error ml-1">
                {t("requiredIndicator")}
              </span>
            )}
          </span>
        </label>
        {error && (
          <p id={errorId} className="text-feedback-error mt-1 ml-6 text-sm">
            {/* Adjusted margin for alignment */}
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
