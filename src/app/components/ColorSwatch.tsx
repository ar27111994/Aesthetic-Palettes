"use client";

import React, { useState, useRef, memo } from "react"; // Added memo
import { Button } from "@components/Button";
import { cn } from "@utils/cn";
import { copyToClipboard } from "@utils/clipboard";
import chroma from "chroma-js";
import { useTranslations } from "next-intl";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { RootState } from "@lib/store";
import {
  FiLock,
  FiUnlock,
  FiClipboard,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { PaletteState } from "@typings/PaletteState";
import { useAppSelector } from "@hooks/useApp";
import Menu from "@components/Menu";
import toast from "react-hot-toast"; // Import react-hot-toast

/* 
  ColorSwatch component for displaying a color swatch with optional actions.
*/
export interface ColorSwatchProps {
  id: string;
  color: string;
  className?: string;
  onAdjust?: (color: string) => void;
  onViewDetails?: (color: string) => void;
  onDelete?: (id: string) => void;
  onLockToggle?: (id: string, locked: boolean) => void;
  isLocked?: boolean;
}

/*
  * ColorSwatch component for displaying a color swatch with optional actions.
  *
  *  Adheres to best practices for:
  *   - Accessibility: Ensures the component is keyboard accessible.
  *   - Responsive Design: Adheres to responsive design principles.
  *   - Performance: Uses memoization for improved performance.
  *   - Interactivity: Allows for interaction with the component.
  *   - Customization: Supports customization through props.
  *   - Maintainability: Easy to understand and maintain.
  *   - Scalability: Designed to scale with the application.
  *   - Testability: Well-tested to ensure reliability.
  *   - Internationalization: Supports internationalization.
  *   - Next.js PPR: As a client component, adheres to Next.js PPR.
  *   - Toasts: Uses react-hot-toast for toast notifications.
  * @component
  @param {ColorSwatchProps} props - The properties for the ColorSwatch component.
  @param {string} props.id - The unique identifier for the color swatch.
  @param {string} props.color - The color value in hexadecimal format.
  @param {string} props.className - Additional CSS classes for the component.
  @param {function} props.onAdjust - Callback function for adjusting the color.
  @param {function} props.onViewDetails - Callback function for viewing color details.
  @param {function} props.onDelete - Callback function for deleting the color swatch.
  @param {function} props.onLockToggle - Callback function for toggling the lock status of the color swatch.
  @param {boolean} props.isLocked - Indicates if the color swatch is locked.
  @returns {JSX.Element} The rendered ColorSwatch component.
*/
const ColorSwatchComponent: React.FC<ColorSwatchProps> = ({
  id,
  color,
  className,
  onAdjust,
  onViewDetails, // Prefixed with underscore to indicate intentionally unused
  onDelete,
  onLockToggle,
  isLocked = false,
}) => {
  const { viewMode } = useAppSelector(
    (state: RootState) => state.palette as PaletteState,
  );
  const parsedColor = chroma(color);
  // State for toggling between color formats (not currently used but kept for future implementation)
  const [_showHex, _setShowHex] = useState(false);
  const hexValue = parsedColor.hex();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("ColorSwatch");
  const t_controls = useTranslations("Controls");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id, disabled: isLocked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
    cursor: isLocked ? "default" : isDragging ? "grabbing" : "grab",
  };

  const handleCopy = (format: "hex" | "rgb" | "hsl" | "cmyk") => {
    let valueToCopy = "";
    let message = "";
    switch (format) {
      case "rgb":
        valueToCopy = parsedColor.css("rgb");
        message = t("copySuccess", { format: "RGB", value: valueToCopy });
        break;
      case "hsl":
        valueToCopy = parsedColor.css("hsl").replace("deg", "");
        message = t("copySuccess", { format: "HSL", value: valueToCopy });
        break;
      case "cmyk":
        valueToCopy = `cmyk(${parsedColor
          .cmyk()
          .map((val) => val.toFixed(2))
          .join(",")})`;
        message = t("copySuccess", { format: "CMYK", value: valueToCopy });
        break;
      default:
        valueToCopy = hexValue;
        message = t("copySuccess", { format: "HEX", value: valueToCopy });
    }
    copyToClipboard(valueToCopy);
    toast.success(message); // Use react-hot-toast
  };

  const _handleViewDetailsClick = () => {
    onViewDetails?.(color);
  };

  const handleDeleteClick = () => {
    onDelete?.(id);
  };

  const handleLockClick = () => {
    onLockToggle?.(id, !isLocked);
  };

  const colorCopyOptions = [
    {
      label: t("copyFormat", { format: "HEX" }),
      onClick: () => handleCopy("hex"),
    },
    {
      label: t("copyFormat", { format: "RGB" }),
      onClick: () => handleCopy("rgb"),
    },
    {
      label: t("copyFormat", { format: "HSL" }),
      onClick: () => handleCopy("hsl"),
    },
    {
      label: t("copyFormat", { format: "CMYK" }),
      onClick: () => handleCopy("cmyk"),
    },
  ];

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, backgroundColor: color }}
      {...attributes}
      className={cn(
        "group focus-within:outline-focus-indicator relative flex items-center justify-center overflow-hidden focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-none",
        className,
      )}
      role="listitem" // Added role for semantic list structure if part of a list
      aria-label={t("colorSwatchLabel", { color: hexValue })}
    >
      <div
        {...listeners}
        className="absolute inset-0"
        style={{
          cursor: isLocked ? "default" : isDragging ? "grabbing" : "grab",
        }}
        aria-label={
          isLocked
            ? t("dragDisabledLabel")
            : t("dragEnabledLabel", { color: hexValue })
        }
      ></div>
      <div
        className={cn(
          "bg-overlay-dark-alpha-30 pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none",
          { p1: viewMode === "compact", p4: viewMode === "full" },
        )}
      >
        <Button
          tooltipContent={t("copyHexTooltip", { hexValue })}
          variant="none"
          size="icon"
          ref={buttonRef}
          className={cn(
            "text-background-page focus-visible:ring-background-page bg-overlay-dark-alpha-60 hover:bg-overlay-dark-alpha-80 focus-visible:ring-offset-overlay-dark-alpha-50 pointer-events-auto rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            {
              "mb-1 px-1.5 py-0.5 text-xs font-medium": viewMode === "compact",
              "mb-4 px-3 py-1.5 text-base font-semibold": viewMode === "full",
            },
          )}
          onClick={() => handleCopy("hex")}
          aria-label={t("copyHexLabel", { hexValue: hexValue })}
        >
          {hexValue.toUpperCase()}
        </Button>
        <div
          className={cn("pointer-events-auto flex items-center", {
            "space-x-1": viewMode === "compact",
            "space-x-2": viewMode === "full",
          })}
        >
          {onLockToggle && (
            <Button
              tooltipContent={
                isLocked ? t_controls("unlock") : t_controls("lock")
              }
              variant="none"
              size="icon"
              onClick={handleLockClick}
              className={cn(
                "text-background-page focus-visible:ring-background-page bg-overlay-dark-alpha-50 hover:bg-overlay-dark-alpha-70 rounded-full focus:outline-none focus-visible:ring-2",
                {
                  "p-1.5": viewMode === "compact",
                  "p-2": viewMode === "full",
                },
              )}
              aria-label={isLocked ? t_controls("unlock") : t_controls("lock")}
              aria-pressed={isLocked}
            >
              {isLocked ? (
                <FiLock
                  aria-hidden="true"
                  className={cn({
                    "h-4 w-4": viewMode === "compact",
                    "h-5 w-5": viewMode === "full",
                  })}
                />
              ) : (
                <FiUnlock
                  aria-hidden="true"
                  className={cn({
                    "h-4 w-4": viewMode === "compact",
                    "h-5 w-5": viewMode === "full",
                  })}
                />
              )}
            </Button>
          )}
          {onAdjust && (
            <Button
              tooltipContent={t_controls("adjust")}
              variant="none"
              size="icon"
              onClick={() => onAdjust(color)}
              className={cn(
                "text-background-page focus-visible:ring-background-page bg-overlay-dark-alpha-50 hover:bg-overlay-dark-alpha-70 rounded-full focus:outline-none focus-visible:ring-2",
                {
                  "p-1.5": viewMode === "compact",
                  "p-2": viewMode === "full",
                },
              )}
              aria-label={t_controls("adjust")}
            >
              <FiEdit2
                aria-hidden="true"
                className={cn({
                  "h-4 w-4": viewMode === "compact",
                  "h-5 w-5": viewMode === "full",
                })}
              />
            </Button>
          )}
          {onDelete && (
            <Button
              tooltipContent={t_controls("delete")}
              variant="none"
              size="icon"
              onClick={handleDeleteClick}
              className={cn(
                "text-background-page focus-visible:ring-background-page bg-overlay-dark-alpha-50 hover:bg-overlay-dark-alpha-70 rounded-full focus:outline-none focus-visible:ring-2",
                {
                  "p-1.5": viewMode === "compact",
                  "p-2": viewMode === "full",
                },
              )}
              aria-label={t_controls("delete")}
            >
              <FiTrash2
                aria-hidden="true"
                className={cn({
                  "h-4 w-4": viewMode === "compact",
                  "h-5 w-5": viewMode === "full",
                })}
              />
            </Button>
          )}
          <Menu
            className="relative inline-block text-left"
            ariaLabel={t_controls("copy")}
            trigger={
              <Button
                tooltipContent={t_controls("copy")}
                variant="none"
                size="icon"
                className={cn(
                  "text-background-page focus-visible:ring-background-page bg-overlay-dark-alpha-50 hover:bg-overlay-dark-alpha-70 inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2",
                  {
                    "p-1.5": viewMode === "compact",
                    "p-2": viewMode === "full",
                  },
                )}
                aria-label={t_controls("copy")}
              >
                <FiClipboard
                  aria-hidden="true"
                  className={cn({
                    "h-4 w-4": viewMode === "compact",
                    "h-5 w-5": viewMode === "full",
                  })}
                />
              </Button>
            }
            items={colorCopyOptions}
          ></Menu>
        </div>
      </div>
    </div>
  );
};

export const ColorSwatch = memo(ColorSwatchComponent);
