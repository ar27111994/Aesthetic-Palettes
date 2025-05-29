"use client";

import React, { forwardRef, useRef } from "react"; // Removed useId, will come from useTextField
import { cn } from "@utils/cn";
import { useTranslations } from "next-intl";
import { useTextField } from "@react-aria/textfield"; // Import useTextField from react-aria
import { mergeProps } from "@react-aria/utils"; // Import mergeProps

// TODO: [Accessibility] Consider using React Aria's useNumberField if the input type is 'number' for better number input handling.
// TODO: [Styling] Ensure tap targets are at least 44x44px for mobile usability (current h-11 is 44px, which is good).
// TODO: [WCAG] Verify contrast ratios for text, borders, and background colors (e.g., text-feedback-error, border-border-divider, bg-background-page, placeholder:text-text-secondary, disabled:text-disabled-control, disabled:bg-disabled-bg) against WCAG AA/AAA guidelines using your Tailwind config.

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "label"> {
  // Omit label as it's handled by react-aria
  label: React.ReactNode; // Allow ReactNode for label for more flexibility
  panelClassName?: string;
  hint?: React.ReactElement; // If hint is simple text, consider passing it as `description` to useTextField
  errorMessage?: string; // Renamed from 'error' to align with react-aria
  success?: boolean;
  successMessage?: string;
  hideLabel?: boolean;
  // [Next.js PPR]: Input fields are client-side interactive. PPR benefits are limited for this component itself.
  // Consider server-side validation messages if applicable for initial render, then client-side updates.
}

const InputField = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      panelClassName,
      hint,
      errorMessage,
      success,
      successMessage,
      id,
      hideLabel = false,
      required,
      ...props // This `props` contains other HTML attributes including `autoCapitalize`
    },
    forwardedRef,
  ) => {
    const t = useTranslations("Forms");
    const localRef = useRef<HTMLInputElement>(null);
    const ref = forwardedRef || localRef;

    // Destructure autoCapitalize, onChange, spellCheck, value and defaultValue from `props` to prevent them from being spread into useTextField options
    // with an incompatible type. They will still be applied to the input element via mergeProps.
    const {
      autoCapitalize,
      value,
      defaultValue,
      onChange,
      spellCheck,
      ...restPropsForTextFieldOptions
    } = props;

    const { labelProps, inputProps, descriptionProps, errorMessageProps } =
      useTextField(
        {
          ...restPropsForTextFieldOptions, // Spread the rest of the props, now excluding autoCapitalize
          id,
          label,
          type,
          inputElementType: "input",
          errorMessage: errorMessage,
          isRequired: required,
        },
        ref as React.RefObject<HTMLInputElement>,
      );

    const labelClasses = cn("block text-sm font-medium mb-1", {
      "sr-only": hideLabel,
    });

    const inputClasses = cn(
      "peer flex h-11 w-full rounded-md border border-border-divider bg-background-page px-3 py-2 text-base ring-offset-focus-indicator file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-indicator disabled:cursor-not-allowed disabled:text-disabled-control disabled:bg-disabled-bg",
      {
        "border-feedback-error focus-visible:outline-feedback-error":
          !!errorMessage,
        "border-feedback-success focus-visible:outline-feedback-success":
          success && !errorMessage,
      },
      className,
    );

    // [SEO] Ensure labels are always present (even if visually hidden) for accessibility and semantic HTML.
    // React Aria's useTextField helps ensure proper label association.

    // [Performance] This component is relatively simple. For complex forms with many InputFields,
    // consider using React.memo on the InputField if profiling shows unnecessary re-renders due to parent updates.
    // However, input fields often change their own state (value), so memoization benefits might be limited.

    return (
      <div className={cn("relative w-full", panelClassName)}>
        <label {...labelProps} className={labelClasses}>
          {label}
          {required && (
            <span className="text-feedback-error ml-1">
              {t("requiredIndicator")}
            </span>
          )}
        </label>
        <input
          {...mergeProps(inputProps, props)} // Pass the original `props` here, which includes `autoCapitalize`
          ref={ref}
          type={type} // Explicitly pass type, as useTextField might not always forward it if it's part of its own logic
          className={inputClasses}
          // aria-invalid is handled by useTextField via inputProps
          // aria-describedby is handled by useTextField via inputProps, descriptionProps, errorMessageProps
        />
        {/* [Accessibility/UX] If 'hint' is an icon leading to a tooltip, ensure the Tooltip component is used and is accessible. */}
        {/* Example: <Tooltip content="Detailed hint"><Icon/></Tooltip> */}
        {hint &&
          React.cloneElement(hint, {
            // If hint is purely informational text, it should be linked via descriptionProps from useTextField
            // For interactive hints (e.g., icon opening a tooltip), ensure it's keyboard accessible and properly labelled.
            id: descriptionProps.id, // Link hint to input via aria-describedby if it's descriptive text
            className: cn(
              "absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2",
              {
                "peer-focus:text-focus-indicator": !errorMessage && !success,
                "text-feedback-success": !errorMessage && success,
                "text-feedback-error": !!errorMessage && !success,
              },
              (hint.props as any).className, // Preserve original className from hint element
            ),
          } as React.DOMAttributes<Element>)}

        {/* [Accessibility] Error messages are linked by useTextField via errorMessageProps */}
        {errorMessage && (
          <p
            {...errorMessageProps}
            className="text-feedback-error mt-1 text-sm"
          >
            {errorMessage}
          </p>
        )}

        {/* [UX] For success messages, consider using react-hot-toast for non-intrusive notifications, especially after form submissions. */}
        {/* The current inline success message is fine for immediate feedback. */}
        {successMessage && success && !errorMessage && (
          // For success messages, ensure they are also announced to screen readers if they appear dynamically.
          // useTextField doesn't have specific successMessageProps, so manage its id for aria-describedby manually if needed.
          // Or, if it's a general description, it could be part of the `description` prop to useTextField.
          <p
            id={
              inputProps["aria-describedby"]
                ? `${inputProps["aria-describedby"]}-success`
                : `${inputProps.id}-success`
            }
            className="text-feedback-success mt-1 text-sm"
          >
            {successMessage}
          </p>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";

export { InputField };
