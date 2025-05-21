"use client";

import React, { useState, useRef } from "react";
import { Button } from "@components/Button";
import { cn } from "@utils/cn";
import { copyToClipboard } from "@utils/clipboard"; // Assuming clipboard utility
import chroma from "chroma-js";
import { useTranslations } from "next-intl"; // Import useTranslations
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { RootState } from "@lib/store"; // Import types
import {
  FiLock,
  FiUnlock,
  FiClipboard,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi"; // Import icons
import { PaletteState } from "@typings/PaletteState";
import { useAppSelector } from "@hooks/useApp";
import Menu from "@components/Menu";

export interface ColorSwatchProps {
  id: string; // Add id prop for dnd-kit
  color: string; // Expecting a valid CSS color string (e.g., hex, rgb, hsl)
  className?: string;
  onAdjust?: (color: string) => void;
  onViewDetails?: (color: string) => void;
  onDelete?: (id: string) => void; // Pass id instead of index
  onLockToggle?: (id: string, locked: boolean) => void; // Pass id instead of index
  isLocked?: boolean;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  id,
  color,
  className,
  onAdjust,
  onViewDetails,
  onDelete,
  onLockToggle,
  isLocked = false,
}) => {
  const { viewMode } = useAppSelector(
    (state: RootState) => state.palette as PaletteState,
  );
  const parsedColor = chroma(color);
  const [showHex, setShowHex] = useState(false);
  const hexValue = parsedColor.hex();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("ColorSwatch"); // Initialize translations
  const t_controls = useTranslations("Controls"); // Translations for controls

  // --- dnd-kit Implementation ---
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
    zIndex: isDragging ? 10 : "auto", // Ensure dragging item is on top
    cursor: isLocked ? "default" : isDragging ? "grabbing" : "grab",
  };
  // --- End dnd-kit Implementation ---

  const handleCopy = (format: "hex" | "rgb" | "hsl" | "cmyk") => {
    let valueToCopy = "";
    switch (format) {
      case "rgb":
        valueToCopy = parsedColor.css("rgb");
        break;
      case "hsl":
        valueToCopy = parsedColor.css("hsl").replace("deg", "");
        break;
      case "cmyk":
        valueToCopy = `cmyk(${parsedColor
          .cmyk()
          .map((cymk) => cymk.toFixed(2))
          .join(",")})`;
        break;
      default:
        valueToCopy = hexValue;
    }
    copyToClipboard(valueToCopy);
    // Add user feedback (e.g., toast notification)
    console.log(`Copied ${format.toUpperCase()}: ${valueToCopy}`);
    // Consider using a toast library here, e.g., react-toastify
    // toast.success(t('copySuccess', { format: format.toUpperCase(), value: valueToCopy }));
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
      ref={setNodeRef} // Apply dnd-kit ref
      style={{ ...style, backgroundColor: color }} // Apply dnd-kit style and background color
      {...attributes} // Apply dnd-kit attributes
      // Remove data-handler-id
      className={cn(
        "group focus-within:outline-focus-indicator relative flex items-center justify-center overflow-hidden focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-none", // Updated focus style, added flex
        className,
      )}
    >
      {/* Drag Handle (optional, apply listeners here if needed) */}
      {/* Example: <Button {...listeners}>Drag Me</Button> */}
      {/* If the whole swatch is draggable, apply listeners to the main div */}
      <div
        {...listeners}
        className="absolute inset-0 cursor-grab"
        style={{
          cursor: isLocked ? "default" : isDragging ? "grabbing" : "grab",
        }}
      ></div>
      {/* Apply listeners to an overlay or the main div */}
      {/* Overlay for controls - visible on group-hover/focus-within */}
      <div
        className={cn(
          "bg-overlay-dark-alpha-30 pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none",
          { p1: viewMode === "compact", p4: viewMode === "full" }, // Adjusted padding for compact/full
        )}
      >
        {/* HEX Code Display (Click to Copy) */}
        <Button
          variant="none"
          size="icon"
          ref={buttonRef}
          className={cn(
            "text-background-page focus-visible:ring-background-page bg-overlay-dark-alpha-60 hover:bg-overlay-dark-alpha-80 focus-visible:ring-offset-overlay-dark-alpha-50 pointer-events-auto rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2", // Added pointer-events-auto
            {
              "mb-1 px-1.5 py-0.5 text-xs font-medium": viewMode === "compact", // Compact styles
              "mb-4 px-3 py-1.5 text-base font-semibold": viewMode === "full", // Full styles
            },
          )}
          onClick={() => handleCopy("hex")}
          aria-label={t("copyHexLabel", { hexValue: hexValue })}
        >
          {hexValue.toUpperCase()}
        </Button>
        {/* Control Buttons */}
        <div
          className={cn("pointer-events-auto flex items-center", {
            "space-x-1": viewMode === "compact",
            "space-x-2": viewMode === "full", // Adjust spacing
          })}
        >
          {/* Lock/Unlock Button */}
          {onLockToggle && (
            <Button
              variant="none"
              size="icon"
              onClick={handleLockClick}
              className={cn(
                "text-background-page focus-visible:ring-background-page bg-overlay-dark-alpha-50 hover:bg-overlay-dark-alpha-70 rounded-full focus:outline-none focus-visible:ring-2",
                {
                  "p-1.5": viewMode === "compact",
                  "p-2": viewMode === "full", // Adjust padding
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
                    "h-5 w-5": viewMode === "full", // Adjust icon size
                  })}
                />
              ) : (
                <FiUnlock
                  aria-hidden="true"
                  className={cn({
                    "h-4 w-4": viewMode === "compact",
                    "h-5 w-5": viewMode === "full", // Adjust icon size
                  })}
                />
              )}
            </Button>
          )}
          {/* Adjust Button */}
          {onAdjust && (
            <Button
              variant="none"
              size="icon"
              onClick={() => onAdjust(color)}
              className={cn(
                "text-background-page focus-visible:ring-background-page bg-overlay-dark-alpha-50 hover:bg-overlay-dark-alpha-70 rounded-full focus:outline-none focus-visible:ring-2",
                {
                  "p-1.5": viewMode === "compact",
                  "p-2": viewMode === "full", // Adjust padding
                },
              )}
              aria-label={t_controls("adjust")}
            >
              <FiEdit2
                aria-hidden="true"
                className={cn({
                  "h-4 w-4": viewMode === "compact",
                  "h-5 w-5": viewMode === "full", // Adjust icon size
                })}
              />
            </Button>
          )}
          {/* Delete Button */}
          {onDelete && (
            <Button
              variant="none"
              size="icon"
              onClick={handleDeleteClick}
              className={cn(
                "text-background-page focus-visible:ring-background-page bg-overlay-dark-alpha-50 hover:bg-overlay-dark-alpha-70 rounded-full focus:outline-none focus-visible:ring-2",
                {
                  "p-1.5": viewMode === "compact",
                  "p-2": viewMode === "full", // Adjust padding
                },
              )}
              aria-label={t_controls("delete")}
            >
              <FiTrash2
                aria-hidden="true"
                className={cn({
                  "h-4 w-4": viewMode === "compact",
                  "h-5 w-5": viewMode === "full", // Adjust icon size
                })}
              />
            </Button>
          )}

          {/* Copy Menu */}
          <Menu
            className="relative inline-block text-left"
            ariaLabel={t_controls("copy")}
            trigger={
              <Button
                variant="none"
                size="icon"
                className={cn(
                  "text-background-page focus-visible:ring-background-page bg-overlay-dark-alpha-50 hover:bg-overlay-dark-alpha-70 inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2",
                  {
                    "p-1.5": viewMode === "compact",
                    "p-2": viewMode === "full", // Adjust padding
                  },
                )}
                aria-label={t_controls("copy")}
              >
                <FiClipboard
                  aria-hidden="true"
                  className={cn({
                    "h-4 w-4": viewMode === "compact",
                    "h-5 w-5": viewMode === "full", // Adjust icon size
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

export { ColorSwatch };
