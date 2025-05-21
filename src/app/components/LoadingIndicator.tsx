import React from "react";
import { cn } from "@utils/cn";
import { Size } from "@typings/Size";
import { useTranslations } from "next-intl"; // Import useTranslations

export interface LoadingIndicatorProps {
  size?: Size;
  className?: string;
  label?: string; // Optional accessible label
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = "md",
  className,
  label,
}) => {
  const t = useTranslations("Common"); // Initialize translations for a common namespace
  const defaultLabel = label || t("loadingLabel"); // Use translation key for default

  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-4",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={defaultLabel} // Use the potentially translated label
      className={cn("flex items-center justify-center", className)}
    >
      <div
        className={cn(
          "border-primary-action animate-spin rounded-full border-t-transparent", // Use primary-action
          sizeClasses[size],
        )}
      ></div>
      <span className="sr-only">{defaultLabel}</span>
      {/* Use the potentially translated label */}
    </div>
  );
};

export { LoadingIndicator };
