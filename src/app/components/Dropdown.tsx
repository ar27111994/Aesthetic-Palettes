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
import { useTranslations } from "next-intl"; // Import useTranslations

export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  hideLabel?: boolean;
  className?: string;
  required?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder, // Removed default value
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
  const t = useTranslations("Forms"); // Initialize translations

  const selectedOption = options.find((option) => option.value === value);

  const labelClasses = cn("block text-sm font-medium mb-1", {
    // Use text-body
    "sr-only": hideLabel,
  });

  const buttonClasses = cn(
    "relative w-full cursor-default rounded-md bg-background-page py-2 pl-3 pr-10 text-left shadow-sm border border-border-divider focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-indicator sm:text-sm h-11", // Use design system colors, focus, size (h-11 for 44px)
    {
      "border-feedback-error focus-visible:outline-feedback-error": error, // Use feedback-error
      "cursor-not-allowed text-disabled-control bg-disabled-bg": disabled, // Use disabled colors
    },
  );

  return (
    <div className={cn("w-full", className)}>
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <>
            <Label id={labelId} className={labelClasses}>
              {label}
              {required && (
                <span className="text-feedback-error ml-1">
                  {t("requiredIndicator")}
                </span>
              )}
              {/* Use translation key */}
            </Label>
            <div className="relative mt-1">
              <ListboxButton
                className={buttonClasses}
                aria-labelledby={labelId}
                aria-invalid={!!error}
                aria-describedby={errorId}
              >
                <span
                  className={cn(
                    "block truncate",
                    {
                      "text-text-body": selectedOption,
                      "text-text-secondary": !selectedOption,
                    }, // Use design system colors
                  )}
                >
                  {selectedOption
                    ? selectedOption.label
                    : (placeholder ?? t("dropdownPlaceholder"))}
                  {/* Use translation key for default placeholder */}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 content-center pr-2">
                  <FiChevronDown
                    className="text-text-secondary h-5 w-5" // Use text-secondary
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="bg-background-page ring-opacity-5 absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm">
                  {/* Use background-page */}

                  {options.map((option) => (
                    <ListboxOption
                      key={option.value}
                      className={({ active }) =>
                        cn(
                          "relative cursor-default py-2 pr-4 pl-10 select-none",
                          {
                            "bg-primary-action text-background-page": active, // Use design system colors
                            "text-text-body": !active, // Use design system colors
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
                              "font-medium": selected,
                              "font-normal": !selected,
                              "text-disabled-control": option.disabled, // Use disabled color
                            })}
                          >
                            {option.label}
                          </span>
                          {selected ? (
                            <span className="text-background-page absolute inset-y-0 left-0 content-center pl-3">
                              {/* Assuming white checkmark on primary-action */}
                              <FiCheck className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
            {error && (
              <p id={errorId} className="text-feedback-error mt-1 text-sm">
                {/* Use feedback-error */}
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
