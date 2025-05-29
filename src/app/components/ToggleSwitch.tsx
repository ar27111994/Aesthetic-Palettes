"use client";

import React, { useId, useState } from "react";
import { Field, Label, Switch } from "@headlessui/react";
import { cn } from "@utils/cn";

export interface ToggleSwitchProps {
  id?: string;
  label: string;
  enabled: boolean;
  onChange?: (enabled: boolean) => void;
  disabled?: boolean;
  hideLabel?: boolean;
  className?: string;
  description?: string; // Added description prop
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  label,
  enabled,
  onChange,
  disabled = false,
  hideLabel = false,
  className,
  description, // Destructure description prop
}) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const generatedId = useId();
  const switchId = id || `toggle-${generatedId}`;
  const labelId = `${switchId}-label`;
  const descriptionId = description ? `${switchId}-description` : undefined;

  const labelClasses = cn(
    "text-sm font-medium ", // Use text-body
    {
      "sr-only": hideLabel,
    },
  );

  const handleChange = (checked: boolean) => {
    if (disabled) {
      return;
    }

    setIsEnabled(checked);
    if (onChange) {
      onChange(checked); // Corrected: pass the new 'checked' state
    }
  };

  return (
    <Field as="div" className={cn("flex flex-col", className)}>
      {" "}
      {/* Changed to flex-col for description */}
      <div className="flex items-center">
        <Switch
          checked={isEnabled}
          onChange={handleChange}
          disabled={disabled}
          id={switchId}
          aria-labelledby={labelId}
          aria-describedby={descriptionId} // Added aria-describedby
          className={cn(
            "focus-visible:ring-focus-indicator focus-visible:ring-offset-background-page relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none", // Use focus-indicator, background-page
            {
              "bg-primary-action": isEnabled, // Use primary-action
              "bg-border-divider": !isEnabled, // Use border-divider
              "bg-disabled-bg cursor-not-allowed opacity-50": disabled, // Use disabled-bg
            },
          )}
        >
          <span className="sr-only">{label}</span>
          <span
            aria-hidden="true"
            className={cn(
              "bg-background-page pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out",
              {
                "translate-x-5": isEnabled,
                "translate-x-0": !isEnabled,
              },
            )}
          />
        </Switch>
        <Label as="span" id={labelId} className={cn("ml-3", labelClasses)}>
          {label}
        </Label>
        {description && descriptionId && (
          <p
            id={descriptionId}
            className="text-text-secondary mt-1 ml-14 text-xs"
          >
            {" "}
            {/* Adjusted margin to align with switch roughly */}
            {description}
          </p>
        )}
      </div>
    </Field>
  );
};

export { ToggleSwitch };
