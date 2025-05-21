import React from "react";
import { cn } from "@utils/cn";
import { Size } from "@typings/Size";

type Variant = "default" | "primary" | "secondary" | "destructive" | "outline";

export interface TagProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
}

const Tag: React.FC<TagProps> = ({
  children,
  className,
  variant = "default",
  size = "md",
}) => {
  const baseClasses =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold motion-reduce:transition-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-indicator focus-visible:ring-offset-2"; // Use focus-indicator

  const variantClasses = {
    default:
      "border-transparent bg-background-subtle text-text-secondary hover:bg-background-subtle/80", // Use design system tokens
    primary:
      "border-transparent bg-primary-action text-background-page hover:bg-primary-action/80", // Use design system tokens
    // Assuming secondary maps to a subtle variant
    secondary:
      "border-transparent bg-secondary-action text-background-page hover:bg-secondary-action/80", // Use design system tokens (adjust if needed)
    destructive:
      "border-transparent bg-feedback-error text-background-page hover:bg-feedback-error/80", // Use design system tokens
    outline: " border-border-divider", // Use design system tokens
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </span>
  );
};

export { Tag };
