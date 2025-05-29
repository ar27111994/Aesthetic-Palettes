"use client";

import React from "react";
import { useRadioGroupState } from "@react-stately/radio";
import { useRadioGroup, useRadio } from "@react-aria/radio";
import { VisuallyHidden } from "@react-aria/visually-hidden"; // Import useVisuallyHidden from React Aria
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import { cn } from "@utils/cn";
import { Tooltip } from "@components/Tooltip"; // Assuming Tooltip is in @components

// ACCESSIBILITY & UX: RadioGroupProps should clearly define the structure of 'options'.
// Consider if 'legendTooltipContent' is always needed or optional.
export interface RadioButtonOption {
  value: string;
  label: React.ReactNode;
  /** Optional tooltip content for this specific radio option. */
  tooltipContent?: React.ReactNode;
  /** Optional: Additional props for the radio input itself, e.g., data-testid */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /** Optional: Additional props for the label wrapper of the radio option. */
  labelProps?: React.HTMLAttributes<HTMLLabelElement>;
}

export interface RadioGroupProps {
  name: string;
  legend: React.ReactNode;
  /** Optional tooltip content for the group's legend. */
  legendTooltipContent?: React.ReactNode;
  options: RadioButtonOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
  /** Additional CSS classes for the fieldset element. */
  fieldsetClassName?: string;
  /** Additional CSS classes for the legend element. */
  legendClassName?: string;
  /** Additional CSS classes for each radio option's wrapper. */
  optionClassName?: string;
  /** Additional CSS classes for the radio input's visual representation (the circle). */
  radioVisualClassName?: string;
  /** Additional CSS classes for the radio label text. */
  radioLabelClassName?: string;
  /** Orientation of the radio buttons. Defaults to 'vertical'. */
  orientation?: "vertical" | "horizontal";
}

// RadioOption component using useRadio for individual radio buttons
const RadioOption: React.FC<{
  option: RadioButtonOption;
  state: ReturnType<typeof useRadioGroupState>;
  radioGroupProps: ReturnType<typeof useRadioGroup>["radioGroupProps"];
  radioVisualClassName?: string;
  radioLabelClassName?: string;
  optionClassName?: string;
}> = ({
  option,
  state,
  // radioGroupProps,
  radioVisualClassName,
  radioLabelClassName,
  optionClassName,
}) => {
  const ref = React.useRef<HTMLInputElement>(null);
  // Configure useRadio with only the props it expects (AriaRadioProps)
  const { inputProps: hookInputProps, labelProps } = useRadio(
    {
      // ...radioGroupProps, // This line remains commented out as per previous fixes
      // Removed spread of option.inputProps from here, as they are for the HTML input element itself
      children: option.label,
      value: option.value,
      // If your RadioButtonOption can be disabled, you would pass it here, e.g.:
      // isDisabled: option.isDisabled
    },
    state,
    ref,
  );
  const { focusProps, isFocusVisible } = useFocusRing();
  const isSelected = state.selectedValue === option.value;

  const radioContent = (
    <label
      {...mergeProps(labelProps, option.labelProps)}
      className={cn(
        "flex cursor-pointer items-center gap-x-2", // Ensure sufficient touch target size (WCAG 2.5.5)
        // RESPONSIVE DESIGN: Adjust gap/padding for smaller screens if necessary.
        "group", // For styling based on group state if needed
        optionClassName,
      )}
    >
      <VisuallyHidden>
        {/* Merge inputProps from useRadio (now hookInputProps), focusProps, and any custom option.inputProps */}
        <input
          {...mergeProps(hookInputProps, focusProps, option.inputProps || {})}
          ref={ref}
        />
      </VisuallyHidden>
      {/* CUSTOMIZABLE VISUALS: Ensure these classes allow for easy theming and contrast adjustments. */}
      {/* WCAG CONTRAST (AA & AAA): Critical for the radio button's visual states (checked/unchecked, focused). */}
      <div
        className={cn(
          "border-border-divider flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors duration-150 ease-in-out",
          // PERFORMANCE: CSS transitions are generally performant. Avoid complex JS animations for state changes.
          {
            "border-primary-action bg-primary-action": isSelected,
            "bg-background-subtle group-hover:border-primary-action-hover":
              !isSelected, // Use appropriate hover state colors
            "ring-focus ring-offset-focus-indicator ring-2 ring-offset-2":
              isFocusVisible,
          }, // Consistent focus indicator
          radioVisualClassName,
        )}
        aria-hidden="true"
      >
        {state.selectedValue === option.value && (
          <div className="bg-background-page h-2 w-2 rounded-full" /> // Inner dot for selected state
        )}
      </div>
      <span className={cn("text-text-body text-sm", radioLabelClassName)}>
        {option.label}
      </span>
    </label>
  );

  if (option.tooltipContent) {
    return (
      <Tooltip content={option.tooltipContent} side="top" sideOffset={4}>
        {radioContent}
      </Tooltip>
    );
  }
  return radioContent;
};

const RadioButtonGroup: React.FC<RadioGroupProps> = ({
  name,
  legend,
  legendTooltipContent,
  options,
  selectedValue,
  onChange,
  className,
  fieldsetClassName,
  legendClassName,
  optionClassName,
  radioVisualClassName,
  radioLabelClassName,
  orientation = "vertical",
}) => {
  // ACCESSIBILITY: useRadioGroupState manages selection and focus state.
  const state = useRadioGroupState({
    name,
    value: selectedValue,
    onChange,
    orientation,
    // label: legend, // React Aria uses this for aria-label on the group if no visible label is present via aria-labelledby
  });

  // ACCESSIBILITY: useRadioGroup provides ARIA props for the group.
  // SEO: The <fieldset> and <legend> are semantically correct for grouping radio buttons.
  const { radioGroupProps, labelProps: groupLabelProps } = useRadioGroup(
    {
      name,
      orientation,
      "aria-label": typeof legend === "string" ? legend : name,
    }, // Provide a string label for aria-label
    state,
  );

  const legendContent = (
    <legend
      {...groupLabelProps}
      className={cn(
        "text-text-heading mb-2 block text-sm font-medium", // WCAG CONTRAST: Ensure this text meets contrast requirements.
        legendClassName,
      )}
    >
      {legend}
    </legend>
  );

  return (
    // NEXT.JS PPR: This component is interactive, so it's a client component ("use client" is at the top).
    // No specific PPR optimizations needed beyond standard React best practices.
    <fieldset
      {...radioGroupProps}
      className={cn(
        "border-border-divider rounded-md border p-4", // Default styling, consider if border is always desired.
        // RESPONSIVE DESIGN: Padding and layout should adapt to screen sizes.
        className,
        fieldsetClassName,
      )}
    >
      {legendTooltipContent ? (
        <Tooltip content={legendTooltipContent} side="top" sideOffset={4}>
          {legendContent}
        </Tooltip>
      ) : (
        legendContent
      )}
      <div
        className={cn(
          "flex",
          {
            "flex-col space-y-2": orientation === "vertical", // Vertical layout
            "flex-row flex-wrap items-center gap-x-4 gap-y-2":
              orientation === "horizontal",
          }, // Horizontal layout with wrapping
          // RESPONSIVE DESIGN: Ensure 'gap' and 'flex-wrap' behave well on small screens.
        )}
      >
        {options.map((option) => (
          <RadioOption
            key={option.value}
            option={option}
            state={state}
            radioGroupProps={radioGroupProps} // Pass the group props, not individual input props here
            radioVisualClassName={radioVisualClassName}
            radioLabelClassName={radioLabelClassName}
            optionClassName={optionClassName}
          />
        ))}
      </div>
    </fieldset>
  );
};

export { RadioButtonGroup };
