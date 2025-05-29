"use client";

import React, { useState } from "react";
import { cn } from "@utils/cn";
import { Size } from "@typings/Size";
import Image from "next/image";
import { Tooltip } from "@components/Tooltip";
import { useTranslations } from "next-intl";

type Shape = "circle" | "square";

export interface AvatarProps {
  /** Source URL for the avatar image. */
  src?: string;
  /**
   * Alt text for the avatar image. Crucial for accessibility (WCAG 1.1.1) and SEO.
   * Provide a descriptive alt text (e.g., "Profile picture of [User Name]").
   * If the avatar is purely decorative and conveys no information, an empty string is acceptable, but avatars are typically informative.
   */
  alt?: string;
  /** Content to display if the image source fails to load or is not provided (e.g., user initials or a default icon). */
  fallback: React.ReactNode;
  /** Size of the avatar. Defaults to 'md'. */
  size?: Size;
  /** Shape of the avatar. Defaults to 'circle'. */
  shape?: Shape;
  /** Optional additional class names for custom styling. */
  className?: string;
  /** Optional content for a tooltip that appears on hover/focus. Useful for displaying full names or additional info. */
  tooltipContent?: string;
}

/**
 * Avatar component to display user profile pictures or fallback content.
 * Ensures WCAG compliance for touch targets (min 44px for 'md' and 'lg' sizes if interactive).
 * For interactivity (e.g., linking to a profile), wrap the Avatar in an accessible button or link component (e.g., using React Aria Button).
 * Fallback text color (`text-text-secondary`) and background (`bg-background-subtle`) should be checked for WCAG AAA contrast.
 */
const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size = "md",
  shape = "circle",
  className,
  tooltipContent,
}) => {
  const [imageError, setImageError] = useState(false);
  const t = useTranslations("Common");
  alt = alt || t("avatarAltText"); // Providing a slightly more descriptive default alt, though specific alt text is always better.

  const sizeClasses = {
    sm: "h-8 w-8", // 32px
    md: "h-11 w-11", // 44px (Ensure min touch target if interactive)
    lg: "h-12 w-12", // 48px
  };

  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-md",
  };

  const baseClasses =
    "inline-flex items-center justify-center overflow-hidden bg-background-subtle align-middle text-text-secondary select-none"; // Use design system colors

  const handleImageError = () => {
    setImageError(true);
  };

  const avatarContent = (
    <span
      className={cn(
        baseClasses,
        sizeClasses[size],
        shapeClasses[shape],
        className,
      )}
      // Consider adding aria-label={alt} if the avatar itself is focusable and interactive,
      // or if the fallback is an icon without text.
    >
      {src && !imageError ? (
        <Image
          src={src}
          alt={alt} // Ensure this alt text is descriptive as per WCAG 1.1.1
          className="h-full w-full object-cover"
          onError={handleImageError}
          // Consider adding `priority` prop if this avatar is likely to be Largest Contentful Paint (LCP) element
        />
      ) : (
        // Ensure fallback content (text or icon) has sufficient contrast with `bg-background-subtle` (WCAG 1.4.3 AA/1.4.6 AAA)
        // If fallback is an icon, ensure it has an accessible name (e.g., via aria-label on the span or a visually hidden text).
        <span className="text-sm font-medium" aria-label={alt}>
          {fallback}
        </span>
      )}
    </span>
  );

  if (tooltipContent) {
    return <Tooltip content={tooltipContent}>{avatarContent}</Tooltip>;
  }

  return avatarContent;
};

export { Avatar };
