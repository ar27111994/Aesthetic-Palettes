"use client";

import React, { useState } from "react";
import Link from "next/link"; // Assuming Next.js for routing
import { FiHeart, FiLink, FiBookmark } from "react-icons/fi"; // Example icons
import { cn } from "@utils/cn";
import { ColorSwatch } from "@components/ColorSwatch"; // Import the ColorSwatch component
import { Tag } from "@components/Tag"; // Assuming a Tag component exists
import { Transition } from "@headlessui/react";
import { useTranslations } from "next-intl"; // Import useTranslations

export interface Palette {
  id: string;
  name: string;
  colors: string[]; // Array of color strings (e.g., hex)
  creatorUsername: string;
  creatorProfileUrl: string; // URL to creator's profile
  likeCount: number;
  tags: string[];
  isLikedByUser?: boolean; // Optional: indicates if the current user liked this
  isSavedByUser?: boolean; // Optional: indicates if the current user saved this
}

export interface PaletteCardProps {
  palette: Palette;
  className?: string;
  onLikeToggle?: (paletteId: string, isLiked: boolean) => void;
  onSaveToggle?: (paletteId: string, isSaved: boolean) => void;
  onCopyLink?: (paletteId: string) => void;
}

const PaletteCard: React.FC<PaletteCardProps> = ({
  palette,
  className,
  onLikeToggle,
  onSaveToggle,
  onCopyLink,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const displayColors = isHovered
    ? palette.colors.slice(0, 10)
    : palette.colors.slice(0, 5);
  const t = useTranslations("PaletteCard"); // Initialize translations

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    onLikeToggle?.(palette.id, !palette.isLikedByUser);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSaveToggle?.(palette.id, !palette.isSavedByUser);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyLink?.(palette.id);
    // Add feedback (e.g., toast)
    console.log("Link copied for palette:", palette.id);
  };

  const paletteUrl = `/palette/${palette.id}`; // Example URL structure

  return (
    <Link
      href={paletteUrl}
      className={cn(
        "group border-border-divider bg-background-page focus-visible:outline-focus-indicator block overflow-hidden rounded-lg border shadow-sm transition-all duration-200 ease-in-out hover:shadow-md focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-none motion-reduce:transition-none", // Use design system colors and focus
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={t("viewPaletteAriaLabel", {
        name: palette.name,
        creator: palette.creatorUsername,
      })} // Use translation key
    >
      {/* Color Swatches Section */}
      <div className="flex h-24 md:h-32">
        {displayColors.map((color, index) => (
          <ColorSwatch
            id={palette.id}
            key={`${palette.id}-${color}-${index}`}
            color={color}
            className="h-full flex-1" // Apply flex-1 and h-full for layout
            // No need for aria-hidden here as ColorSwatch might handle accessibility internally or be inherently decorative
          />
        ))}
      </div>

      {/* Info Section */}
      <div className="p-3 md:p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="group-hover:text-primary-action truncate text-base leading-tight font-semibold">
            {/* Use primary action color on hover */}
            {palette.name}
          </h3>
          {/* Like Count */}
          <div className="text-text-secondary ml-2 flex flex-shrink-0 items-center text-sm">
            {/* Use text-secondary */}
            <FiHeart
              className="text-feedback-error mr-1 h-4 w-4"
              aria-hidden="true"
            />
            {/* Use feedback-error */}
            <span
              aria-label={t("likeCountAriaLabel", { count: palette.likeCount })}
            >
              {/* Use translation key */}
              {palette.likeCount}
            </span>
          </div>
        </div>

        {/* Creator Info */}
        <Link
          href={palette.creatorProfileUrl}
          onClick={(e) => e.stopPropagation()} // Prevent card navigation when clicking creator link
          className="text-text-secondary hover:text-primary-action focus-visible:ring-focus-indicator rounded text-xs hover:underline focus:outline-none focus-visible:ring-1" // Use text-secondary, primary-action, focus-indicator
          aria-label={t("viewCreatorProfileAriaLabel", {
            creator: palette.creatorUsername,
          })} // Use translation key
        >
          {t("creatorPrefix")} {palette.creatorUsername}
          {/* Use translation key */}
        </Link>

        {/* Tags (Optional) */}
        {palette.tags && palette.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {palette.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} size="sm">
                {tag}
              </Tag>
            ))}
            {palette.tags.length > 3 && (
              <span className="text-text-secondary text-xs">...</span> // Use text-secondary
            )}
          </div>
        )}

        {/* Hover/Focus Actions */}
        <Transition
          show={
            isHovered || document.activeElement?.closest("a") === event?.target
          }
          enter="motion-reduce:transition-none transition-opacity duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="motion-reduce:transition-none transition-opacity duration-100 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="border-border-divider mt-3 flex justify-end space-x-2 border-t pt-3">
            {/* Use border-divider */}
            {onLikeToggle && (
              <button
                onClick={handleLike}
                className="text-text-secondary hover:bg-background-subtle hover:text-text-body focus-visible:ring-focus-indicator rounded-full p-1.5 focus:outline-none focus-visible:ring-1 focus-visible:outline-none" // Use design system colors and focus
                aria-label={
                  palette.isLikedByUser
                    ? t("unlikePaletteAriaLabel")
                    : t("likePaletteAriaLabel") // Use translation keys
                }
                aria-pressed={palette.isLikedByUser}
              >
                {
                  <FiHeart
                    className={cn(
                      "h-5 w-5",
                      palette.isLikedByUser
                        ? "text-feedback-error fill-current"
                        : "",
                    )}
                    aria-hidden="true"
                  />
                }
              </button>
            )}
            {onSaveToggle && (
              <button
                onClick={handleSave}
                className="text-text-secondary hover:bg-background-subtle hover:text-text-body focus-visible:ring-focus-indicator rounded-full p-1.5 focus:outline-none focus-visible:ring-1 focus-visible:outline-none" // Use design system colors and focus
                aria-label={
                  palette.isSavedByUser
                    ? t("unsavePaletteAriaLabel")
                    : t("savePaletteAriaLabel") // Use translation keys
                }
                aria-pressed={palette.isSavedByUser}
              >
                <FiBookmark
                  className={cn(
                    "h-5 w-5",
                    palette.isSavedByUser
                      ? "text-primary-action fill-current"
                      : "",
                  )}
                  aria-hidden="true"
                />
              </button>
            )}
            {onCopyLink && (
              <button
                onClick={handleCopy}
                className="text-text-secondary hover:bg-background-subtle hover:text-text-body focus-visible:ring-focus-indicator rounded-full p-1.5 focus:outline-none focus-visible:ring-1 focus-visible:outline-none" // Use design system colors and focus
                aria-label={t("copyLinkAriaLabel")} // Use translation key
              >
                <FiLink className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
        </Transition>
      </div>
    </Link>
  );
};

export { PaletteCard };
