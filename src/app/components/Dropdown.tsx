"use client";

import React, { Fragment, useId } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { cn } from "@utils/cn";
import { useTranslations } from "next-intl";
import { Tooltip } from "./Tooltip"; // Import Tooltip component

/**
 * Represents an option in the dropdown.
 */
export interface DropdownOption {
  /** The actual value of the option. */
  value: string | number;
  /** The human-readable label for the option. */
  label: string;
  /** Whether the option is disabled. Defaults to false. */
  disabled?: boolean;
  /** Optional reason why the option is disabled, for tooltip display. */
  disabledReason?: string;
}

/**
 * Props for the Dropdown component.
 */
export interface DropdownProps {
  /** Array of options to display in the dropdown. */
  options: DropdownOption[];
  /** The currently selected value. */
  value?: string | number;
  /** Callback function triggered when the selected value changes. */
  onChange: (value: string | number) => void;
  /** The label for the dropdown, displayed above it. */
  label: string;
  /** Placeholder text to display when no option is selected. Defaults to a translated placeholder. */
  placeholder?: string;
  /** Whether the dropdown is disabled. Defaults to false. */
  disabled?: boolean;
  /** Error message to display below the dropdown. */
  error?: string;
  /** Whether to hide the label visually (still accessible to screen readers). Defaults to false. */
  hideLabel?: boolean;
  /** Additional CSS class names for the wrapper div. */
  className?: string;
  /** Whether the dropdown is a required field. Adds a visual indicator. Defaults to false. */
  required?: boolean;
}

/**
 * A reusable Dropdown component built with Headless UI for accessibility.
 * It supports labels, placeholders, error states, disabled states, and internationalization.
 *
 * Accessibility Features:
 * - Uses Headless UI's Listbox, which handles ARIA attributes (e.g., `aria-activedescendant`, `aria-labelledby`, `aria-expanded`, `aria-haspopup`, `role="listbox"`, `role="option"`) and keyboard navigation (Up/Down arrows, Home/End, PageUp/PageDown, Enter/Space to select, Esc to close).
 * - `aria-invalid` and `aria-describedby` are used for error states.
 * - Labels are associated with the ListboxButton via `aria-labelledby`.
 * - Icons have `aria-hidden="true"` as they are decorative.
 * - Tooltips are provided for disabled options to explain their state.
 *
 * SEO Considerations:
 * - Dropdown content is generally client-rendered. If the selected value influences SEO-critical content on the page, ensure that content is server-renderable or properly handled for crawlers.
 *
 * Performance Optimization:
 * - Uses `React.Fragment` for transitions to avoid unnecessary DOM elements.
 * - Consider `React.memo` for this component if it becomes a performance bottleneck due to frequent re-renders with unchanged props in a complex application.
 *
 * Next.js PPR (Partial Prerendering):
 * - This component is marked with `"use client"` and will be client-rendered.
 * - Initial options and selected value can be passed as props from server components if determined server-side.
 *
 * WCAG Contrast:
 * - Relies on the design system's color tokens (e.g., `text-body`, `bg-primary-action`, `border-feedback-error`) which should be WCAG compliant.
 * - Ensure custom styling maintains sufficient contrast.
 */
const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  error,
  hideLabel = false,
  className,
  required,
}) => {
  const generatedId = useId();
  const listboxId = `dropdown-${generatedId}`;
  const labelId = `${listboxId}-label`;
  const errorId = error ? `${listboxId}-error` : undefined;
  const t = useTranslations("Forms");

  const selectedOption = options.find((option) => option.value === value);

  const labelClasses = cn(
    "block text-sm font-medium mb-1 text-text-body", // Ensure text-body for default label color
    {
      "sr-only": hideLabel, // Visually hide label but keep it accessible
    },
  );

  const buttonClasses = cn(
    "relative w-full cursor-default rounded-md bg-background-page py-2 pl-3 pr-10 text-left shadow-sm border border-border-divider focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-indicator sm:text-sm h-11", // Consistent height (44px), uses design tokens for colors and focus
    {
      "border-feedback-error focus-visible:outline-feedback-error": error, // Error state styling
      "cursor-not-allowed text-disabled-control bg-disabled-bg": disabled, // Disabled state styling
    },
  );

  return (
    <div className={cn("w-full", className)}>
      {/* Headless UI Listbox handles most ARIA attributes and keyboard navigation */}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {() => (
          <>
            <Label id={labelId} className={labelClasses}>
              {label}
              {required && (
                <span className="text-feedback-error ml-1" aria-hidden="true">
                  {/* Use translated required indicator, aria-hidden as the 'required' prop on input or fieldset should convey this semantically */}
                  {t("requiredIndicator")}
                </span>
              )}
            </Label>
            <div className="relative mt-1">
              <ListboxButton
                className={buttonClasses}
                aria-labelledby={labelId} // Associates button with the label
                aria-invalid={!!error} // Indicates an error state if present
                aria-describedby={errorId} // Points to the error message if present
                aria-required={required} // Indicates if the field is required
              >
                <span
                  className={cn(
                    "block truncate", // Prevents long text from breaking layout
                    {
                      "text-text-body": selectedOption, // Style for selected option text
                      "text-text-secondary": !selectedOption, // Style for placeholder text
                    },
                  )}
                >
                  {selectedOption
                    ? selectedOption.label
                    : (placeholder ?? t("dropdownPlaceholder"))}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <FiChevronDown
                    className="text-text-secondary h-5 w-5" // Chevron icon styling
                    aria-hidden="true" // Decorative icon
                  />
                </span>
              </ListboxButton>
              <Transition
                as={Fragment} // Use Fragment to avoid extra div
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                // Transition for smooth appearance/disappearance of options
              >
                <ListboxOptions className="bg-background-page ring-opacity-5 absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm">
                  {/* Styling for the options panel. max-h-60 for mobile-friendliness */}
                  {options.map((option) => {
                    const optionContent = (
                      <ListboxOption
                        key={option.value}
                        className={({ active }) =>
                          cn(
                            "relative cursor-default py-2 pr-4 pl-10 select-none",
                            {
                              "bg-primary-action text-background-page": active, // Style for active/hovered option
                              "text-text-body": !active, // Default text color for options
                              "text-disabled-control cursor-not-allowed":
                                option.disabled, // Style for disabled option
                            },
                          )
                        }
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={cn("block truncate", {
                                "font-medium": selected, // Style for selected option text in list
                                "font-normal": !selected,
                                "text-disabled-control": option.disabled, // Ensure disabled text color is applied
                              })}
                            >
                              {option.label}
                            </span>
                            {selected ? (
                              <span className="text-primary-action-text absolute inset-y-0 left-0 flex items-center pl-3">
                                {/* Ensure checkmark color contrasts with active background (primary-action) */}
                                {/* Assuming primary-action-text is a token for text on primary-action background */}
                                <FiCheck
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </ListboxOption>
                    );

                    if (option.disabled) {
                      return (
                        <Tooltip
                          key={`${option.value}-tooltip`}
                          content={
                            option.disabledReason || t("optionDisabledTooltip")
                          }
                          side="right"
                          sideOffset={5}
                        >
                          {/* Wrapping div for Tooltip Trigger, as ListboxOption might not forward refs correctly or might be complex */}
                          <div>{optionContent}</div>
                        </Tooltip>
                      );
                    }
                    return optionContent;
                  })}
                </ListboxOptions>
              </Transition>
            </div>
            {error && (
              <p
                id={errorId}
                className="text-feedback-error mt-1 text-sm"
                role="alert"
              >
                {/* Error message styling and role for accessibility */}
                {error}
              </p>
            )}
          </>
        )}
      </Listbox>
    </div>
  );
};

export { Dropdown };
