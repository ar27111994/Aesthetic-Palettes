import React, { forwardRef } from "react";
import { cn } from "@utils/cn";
import { Size } from "@typings/Size";
import { useButton, mergeProps, useObjectRef } from "react-aria"; // useFocusableRef is often re-exported or from @react-aria/utils
import { AriaButtonProps } from "@react-types/button";
import { Tooltip } from "@components/Tooltip"; // Assuming Tooltip path

type Variant = "default" | "primary" | "secondary" | "destructive" | "outline";

export interface TagProps extends Omit<AriaButtonProps<"button">, "children"> {
  children: React.ReactNode; // Make children explicitly required
  className?: string;
  variant?: Variant;
  size?: Size;
  tooltip?: string | React.ReactNode;
  tooltipSide?: "top" | "right" | "bottom" | "left";
}

const Tag = forwardRef<HTMLButtonElement, TagProps>((props, ref) => {
  const {
    children,
    className,
    variant = "default",
    size = "md",
    tooltip,
    tooltipSide,
    ...ariaButtonCompatibleProps // Contains onPress, isDisabled, aria-label, id, etc.
  } = props;

  // Pass props that AriaButtonProps expects, plus any other valid HTML button attributes
  const buttonRef = useObjectRef<HTMLButtonElement>(ref);

  const { buttonProps, isPressed } = useButton(
    ariaButtonCompatibleProps as AriaButtonProps<"button">, // Cast to ensure type compatibility for useButton
    buttonRef,
  );

  const baseClasses =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold motion-reduce:transition-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-indicator focus-visible:ring-offset-2"; // Use focus-indicator

  // Updated variant classes for WCAG AA contrast and design system token usage
  const variantClasses: Record<Variant, string> = {
    default:
      "border-transparent bg-background-subtle text-text-body hover:bg-background-subtle-alpha-80", // Ensure text-text-body provides enough contrast
    primary:
      "border-transparent bg-primary-action text-background-page hover:bg-primary-action-alpha-80", // text-background-page for high contrast on primary
    secondary:
      "border-transparent bg-secondary-action text-background-page hover:bg-secondary-action-alpha-80", // Darker green for contrast
    destructive:
      "border-transparent bg-feedback-error text-background-page hover:bg-feedback-error-alpha-80", // Darker red for contrast
    outline: "border-border-divider text-text-body hover:bg-background-subtle", // Explicit text color and hover for outline
  };

  const sizeClasses: Record<Size, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  };

  const tagElement = (
    <button
      type="button"
      {...mergeProps(buttonProps, ariaButtonCompatibleProps)} // Merge props from useButton with other passed-in HTML attributes
      ref={buttonRef} // Use the ref from useFocusableRef
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        // Example: Apply style when pressed, if desired. useButton provides `isPressed`.
        { "scale-95 opacity-80": isPressed },
        className,
      )}
    >
      {children}
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} side={tooltipSide}>
        {tagElement}
      </Tooltip>
    );
  }

  return tagElement;
});

export { Tag };
