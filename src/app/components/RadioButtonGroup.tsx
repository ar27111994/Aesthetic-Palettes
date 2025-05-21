"use client";

import React, { useId } from "react";
import { useTranslations } from "next-intl"; // Import useTranslations
import { Label, Radio, RadioGroup } from "@headlessui/react";
import { cn } from "@utils/cn";

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface RadioButtonGroupProps {
  options: RadioOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  legend: string; // The label for the entire group (fieldset legend)
  hideLegend?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  required?: boolean; // Applies to the group
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  options,
  value,
  onChange,
  legend,
  hideLegend = false,
  disabled = false,
  error,
  className,
  required,
}) => {
  const generatedId = useId();
  const groupId = `radio-group-${generatedId}`;
  const legendId = `${groupId}-legend`;
  const errorId = error ? `${groupId}-error` : undefined;
  const t = useTranslations("Forms"); // Initialize translations

  const legendClasses = cn(
    "block text-sm font-medium mb-2", // Use text-body
    {
      "sr-only": hideLegend,
    },
  );

  return (
    <fieldset
      className={cn("w-full", className)}
      aria-labelledby={legendId}
      aria-required={required}
      aria-invalid={!!error}
      aria-describedby={errorId}
    >
      <legend id={legendId} className={legendClasses}>
        {legend}
        {required && (
          <span className="text-feedback-error ml-1">
            {t("requiredIndicator")}
          </span>
        )}
        {/* Use feedback-error */}
      </legend>
      <RadioGroup
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="space-y-2"
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            disabled={option.disabled || disabled}
            className={({ focus, checked, disabled: itemDisabled }) =>
              cn(
                "relative flex cursor-pointer rounded-lg border px-5 py-4 shadow-md focus:outline-none", // Added border
                {
                  "border-border-divider": !focus, // Use border-divider
                  "ring-focus-indicator ring-offset-background-page ring-2 ring-offset-2":
                    focus, // Use focus-indicator, background-page
                  "bg-primary-action border-primary-action text-background-page":
                    checked, // Use primary-action
                  "bg-background-page text-text-body": !checked, // Use background-page, text-body
                  "bg-disabled-bg text-disabled-control border-border-divider cursor-not-allowed":
                    itemDisabled, // Use disabled colors
                  "hover:bg-background-subtle": !itemDisabled, // Use background-subtle
                },
              )
            }
          >
            {({ checked, disabled: itemDisabled }) => (
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm">
                    <Label
                      as="p"
                      className={cn("font-medium", {
                        // Keep font-medium
                        "text-background-page": checked, // Use white for checked label
                        "text-text-heading": !checked, // Use text-heading for unchecked label
                        "text-disabled-control": itemDisabled, // Use disabled-control for disabled label
                      })}
                    >
                      {option.label}
                    </Label>
                    {/* Optional: Add description here if needed */}
                  </div>
                </div>
                {checked && (
                  <div className="text-background-page shrink-0">
                    {/* Checkmark Icon */}
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="fill-background-page"
                        cx={12}
                        cy={12}
                        r={12}
                        fillOpacity={0.2}
                      />
                      <path
                        className="stroke-background-page"
                        d="M7 13l3 3 7-7"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            )}
          </Radio>
        ))}
      </RadioGroup>
      {error && (
        <p id={errorId} className="text-feedback-error mt-2 text-sm">
          {/* Use feedback-error */}
          {error}
        </p>
      )}
    </fieldset>
  );
};

export { RadioButtonGroup };
