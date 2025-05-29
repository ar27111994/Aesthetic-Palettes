"use client";

import React from "react";
import { cn } from "@utils/cn"; // Assuming cn utility path
import { Size } from "@typings/Size"; // Assuming Size type path
import { useTranslations } from "next-intl";
import { useVisuallyHidden } from "@react-aria/visually-hidden"; // Import useVisuallyHidden from React Aria

export interface LoadingIndicatorProps {
  size?: Size;
  className?: string;
  label?: string; // Optional accessible label, will be announced by screen readers.
}

/**
 * LoadingIndicator component displays a spinning animation to indicate a loading state.
 * It is designed with accessibility and performance in mind.
 *
 * Accessibility:
 * - Uses `role="status"` and `aria-live="polite"` to announce loading state to screen readers.
 * - `aria-label` provides a human-readable label for the loading state (translatable).
 * - Screen-reader-only text is handled using `useVisuallyHidden` from React Aria for robustness.
 * - Keyboard Navigation: This component itself is not interactive. Focus management for content being loaded
 *   should be handled by the consuming component/page.
 * - Tooltips/Toasts: Not applicable for this component; it's a passive status indicator.
 *
 * Responsiveness & Mobile-First:
 * - Sizing is controlled via the `size` prop and can be further customized with `className`.
 * - Uses flexbox for centering, adapting well to different container sizes.
 *
 * WCAG Contrast:
 * - The spinner color is `border-primary-action`. The actual color depends on the Tailwind theme configuration.
 * - It's crucial that `primary-action` provides sufficient contrast (min 3:1 for AA, 4.5:1 for AAA for graphics) against its background.
 *   This needs to be ensured at the theme level.
 *
 * Performance:
 * - Uses efficient CSS animations (`animate-spin` from Tailwind CSS).
 * - Lightweight component with minimal JavaScript.
 *
 * SEO:
 * - As a presentational component for loading states, it has a neutral direct impact on SEO.
 * - Good accessibility practices can indirectly benefit SEO.
 *
 * Next.js PPR (Partial Prerendering):
 * - This is a client-side component and is fully compatible with Next.js PPR strategies.
 *   It will render on the client as part of the dynamic shell or client-side navigations.
 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = "md",
  className,
  label,
}) => {
  const t = useTranslations("Common");
  const defaultLabel = label || t("loadingLabel");
  const { visuallyHiddenProps } = useVisuallyHidden(); // Use React Aria's hook for sr-only text

  // Size classes are mapped to Tailwind CSS classes for styling the spinner dimensions and border.
  const sizeClasses = {
    sm: "h-4 w-4 border-2", // Small size spinner
    md: "h-6 w-6 border-2", // Medium (default) size spinner
    lg: "h-8 w-8 border-4", // Large size spinner
  };

  return (
    <div
      role="status" // Informs assistive technologies that this region's content may change and is a status message.
      aria-live="polite" // Announces changes to the user when they are idle, suitable for loading messages.
      aria-label={defaultLabel} // Provides an accessible name for the status region.
      className={cn("flex items-center justify-center", className)} // Applies base layout and custom classes.
    >
      {/* The visual spinner element */}
      <div
        className={cn(
          "border-primary-action animate-spin rounded-full border-t-transparent", // Styling for the spinner: color, animation, shape.
          sizeClasses[size], // Applies dynamic size class based on the `size` prop.
        )}
      ></div>
      {/* Screen-reader only text, hidden visually but read by assistive technologies. */}
      {/* This reinforces the loading message provided by aria-label on the parent. */}
      <span {...visuallyHiddenProps}>{defaultLabel}</span>
    </div>
  );
};

export { LoadingIndicator };
