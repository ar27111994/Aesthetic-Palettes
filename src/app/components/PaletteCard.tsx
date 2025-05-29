"use client";

import React, { useState, useRef } from "react"; // Added useRef
import Link from "next/link";
import { FiHeart, FiLink, FiBookmark } from "react-icons/fi";
import { cn } from "@utils/cn"; // Corrected path assuming @ is src or similar alias
import { ColorSwatch } from "@components/ColorSwatch"; // Corrected path
import { Tag } from "@components/Tag"; // Corrected path
import { Button } from "@components/Button"; // Corrected path
import { Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast"; // Added react-hot-toast

export interface Palette {
  id: string;
  name: string;
  colors: string[];
  creatorUsername: string;
  creatorProfileUrl: string;
  likeCount: number;
  tags: string[];
  isLikedByUser?: boolean;
  isSavedByUser?: boolean;
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
  const linkRef = useRef<HTMLAnchorElement>(null); // Added ref for the Link
  const displayColors = isHovered
    ? palette.colors.slice(0, 10)
    : palette.colors.slice(0, 5);
  const t = useTranslations("PaletteCard");

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLikeToggle?.(palette.id, !palette.isLikedByUser);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSaveToggle?.(palette.id, !palette.isSavedByUser);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCopyLink?.(palette.id);
    toast.success(t("linkCopiedToast"));
  };

  const paletteUrl = `/palettes/${palette.id}`;

  return (
    <Link
      href={paletteUrl}
      ref={linkRef} // Added ref to Link
      className={cn(
        "group border-border-divider bg-background-page focus-visible:outline-focus-indicator block overflow-hidden rounded-lg border shadow-sm transition-all duration-200 ease-in-out hover:shadow-md focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-none motion-reduce:transition-none",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={t("viewPaletteAriaLabel", {
        name: palette.name,
        creator: palette.creatorUsername,
      })}
    >
      {/* Color Swatches Section */}
      <div className="flex h-24 md:h-32">
        {displayColors.map((color, index) => (
          <ColorSwatch
            id={palette.id} // id prop was already here, ensure ColorSwatch uses it if needed for a11y
            key={`${palette.id}-${color}-${index}`}
            color={color}
            className="h-full flex-1"
          />
        ))}
      </div>

      {/* Info Section */}
      <div className="p-3 md:p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="group-hover:text-primary-action truncate text-base leading-tight font-semibold">
            {palette.name}
          </h3>
          <div className="text-text-secondary ml-2 flex flex-shrink-0 items-center text-sm">
            <FiHeart
              className="text-feedback-error mr-1 h-4 w-4"
              aria-hidden="true"
            />
            <span
              aria-label={t("likeCountAriaLabel", { count: palette.likeCount })}
            >
              {palette.likeCount}
            </span>
          </div>
        </div>

        <Link
          href={palette.creatorProfileUrl}
          onClick={(e) => e.stopPropagation()}
          className="text-text-secondary hover:text-primary-action focus-visible:ring-focus-indicator rounded text-xs hover:underline focus:outline-none focus-visible:ring-1"
          aria-label={t("viewCreatorProfileAriaLabel", {
            creatorUsername: palette.creatorUsername,
          })}
        >
          {t("creatorPrefix")} {palette.creatorUsername}
        </Link>

        {palette.tags && palette.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {palette.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} size="sm">
                {tag}
              </Tag>
            ))}
            {palette.tags.length > 3 && (
              <span className="text-text-secondary text-xs">...</span>
            )}
          </div>
        )}

        <Transition
          show={
            isHovered ||
            Boolean(
              linkRef.current &&
                document.activeElement?.closest("a") === linkRef.current,
            )
          }
          enter="motion-reduce:transition-none transition-opacity duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="motion-reduce:transition-none transition-opacity duration-100 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="border-border-divider mt-3 flex justify-end space-x-2 border-t pt-3">
            {onLikeToggle && (
              <Button
                onClick={handleLike}
                variant="none"
                className="text-text-secondary hover:bg-background-subtle hover:text-text-body focus-visible:ring-focus-indicator rounded-full p-3 focus:outline-none focus-visible:ring-1 focus-visible:outline-none" // Increased padding to p-3
                aria-label={
                  palette.isLikedByUser
                    ? t("unlikePaletteAriaLabel")
                    : t("likePaletteAriaLabel")
                }
                tooltipContent={
                  palette.isLikedByUser
                    ? t("unlikePaletteAriaLabel")
                    : t("likePaletteAriaLabel")
                }
                aria-pressed={palette.isLikedByUser}
              >
                <FiHeart
                  className={cn(
                    "h-5 w-5",
                    palette.isLikedByUser
                      ? "text-feedback-error fill-current"
                      : "",
                  )}
                  aria-hidden="true"
                />
              </Button>
            )}
            {onSaveToggle && (
              <Button
                onClick={handleSave}
                variant="none"
                className="text-text-secondary hover:bg-background-subtle hover:text-text-body focus-visible:ring-focus-indicator rounded-full p-3 focus:outline-none focus-visible:ring-1 focus-visible:outline-none" // Increased padding to p-3
                aria-label={
                  palette.isSavedByUser
                    ? t("unsavePaletteAriaLabel")
                    : t("savePaletteAriaLabel")
                }
                tooltipContent={
                  palette.isSavedByUser
                    ? t("unsavePaletteAriaLabel")
                    : t("savePaletteAriaLabel")
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
              </Button>
            )}
            {onCopyLink && (
              <Button
                onClick={handleCopy}
                variant="none"
                className="text-text-secondary hover:bg-background-subtle hover:text-text-body focus-visible:ring-focus-indicator rounded-full p-3 focus:outline-none focus-visible:ring-1 focus-visible:outline-none" // Increased padding to p-3
                aria-label={t("copyLinkAriaLabel")}
                tooltipContent={t("copyLinkAriaLabel")}
              >
                <FiLink className="h-5 w-5" aria-hidden="true" />
              </Button>
            )}
          </div>
        </Transition>
      </div>
    </Link>
  );
};

export { PaletteCard };
