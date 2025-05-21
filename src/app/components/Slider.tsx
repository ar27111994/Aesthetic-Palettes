"use client";

import React, { forwardRef, useId, useState } from "react";
import { useTranslations } from "next-intl"; // Import useTranslations
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@utils/cn";

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label: string;
  hideLabel?: boolean;
}

const Slider = forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      label,
      hideLabel = false,
      id,
      min = 0,
      max = 100,
      step = 1,
      value: controlledValue,
      defaultValue,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const sliderId = id || generatedId;
    const labelId = `${sliderId}-label`;
    const t = useTranslations("Slider"); // Initialize translations

    // Manage internal state if defaultValue is provided, otherwise use controlledValue
    const [internalValue, setInternalValue] = useState(defaultValue || [min]);
    const currentValue =
      controlledValue !== undefined ? controlledValue : internalValue;

    const handleValueChange = (newValue: number[]) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    const labelClasses = cn(
      "block text-sm font-medium mb-1", // Use text-body
      {
        "sr-only": hideLabel,
      },
    );

    return (
      <div className="w-full">
        <label id={labelId} className={labelClasses}>
          {label}
        </label>
        <SliderPrimitive.Root
          ref={ref}
          id={sliderId}
          min={min}
          max={max}
          step={step}
          value={currentValue}
          defaultValue={defaultValue} // Pass defaultValue to Radix
          onValueChange={handleValueChange} // Use the combined handler
          aria-labelledby={labelId}
          className={cn(
            "relative flex w-full touch-none items-center select-none",
            className,
          )}
          {...props}
        >
          <SliderPrimitive.Track className="bg-border-divider relative h-2 w-full grow overflow-hidden rounded-full">
            {/* Use border-divider */}
            <SliderPrimitive.Range className="bg-primary-action absolute h-full" />
            {/* Use primary-action */}
          </SliderPrimitive.Track>
          {currentValue.map((val, index) => (
            <SliderPrimitive.Thumb
              key={index}
              className="border-primary-action bg-background-page ring-offset-background-page focus-visible:ring-focus-indicator disabled:bg-disabled-bg disabled:border-border-divider block h-5 w-5 rounded-full border-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none" // Use design system colors, focus, disabled
              aria-label={t("thumbAriaLabel", { index: index + 1 })} // Use translation key
              aria-valuenow={val}
              aria-valuemin={min}
              aria-valuemax={max}
            />
          ))}
        </SliderPrimitive.Root>
        {/* Display current value numerically - enhance as needed */}
        <div className="text-text-secondary mt-1 text-sm" aria-live="polite">
          {/* Use text-secondary */}
          {t("currentValueLabel")}: {currentValue.join(", ")}
          {/* Use translation key */}
        </div>
      </div>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
