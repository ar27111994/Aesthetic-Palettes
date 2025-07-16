// app/components/ColorSwatch.tsx
"use client";

import React, { useState, useRef, useMemo } from "react";
import { Button } from "@components/Button";
import { cn } from "@utils/cn";
import { copyToClipboard } from "@utils/clipboard";
import chroma from "chroma-js";
import { useTranslations } from "next-intl";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RootState } from "@lib/store";
import { PaletteState } from "@typings/PaletteState";
import { useAppSelector } from "@hooks/useApp";
import { Menu } from "@components/Menu";
import toast from "react-hot-toast";
import {
  FiLock,
  FiUnlock,
  FiClipboard,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

/**
 * Props for the ColorSwatch component.
 * @interface ColorSwatchProps
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

/**
 * ColorSwatch component for displaying a color swatch with interactive actions.
 * @component
 * @param {ColorSwatchProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered ColorSwatch component.
 */
export const ColorSwatch: React.FC<ColorSwatchProps> = React.memo(
  ({
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
    const t = useTranslations("ColorSwatch");
    const t_accessibility = useTranslations("Accessibility");
    const t_controls = useTranslations("Controls");
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Validate and memoize color parsing
    const parsedColor = useMemo(() => {
      if (!chroma.valid(color)) {
        console.warn(`Invalid color value: ${color}`);
        return chroma("#000000"); // Fallback to black
      }
      return chroma(color);
    }, [color]);

    const hexValue = parsedColor.hex();
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id, disabled: isLocked });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 10 : "auto",
      cursor: isLocked ? "default" : isDragging ? "grabbing" : "grab",
      backgroundColor: hexValue,
    };

    const handleCopy = async (format: "hex" | "rgb" | "hsl" | "cmyk") => {
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

      try {
        await copyToClipboard(valueToCopy);
        toast.success(message);
      } catch {
        toast.error(t("copyError", { defaultValue: "Failed to copy color" }));
      }
    };

    const handleDeleteClick = () => onDelete?.(id);
    const handleLockClick = () => onLockToggle?.(id, !isLocked);

    const colorCopyOptions = [
      {
        label: t("copyFormat", { format: "HEX" }),
        onClick: () => handleCopy("hex"),
        "aria-label": t("copyFormat", { format: "HEX" }),
      },
      {
        label: t("copyFormat", { format: "RGB" }),
        onClick: () => handleCopy("rgb"),
        "aria-label": t("copyFormat", { format: "RGB" }),
      },
      {
        label: t("copyFormat", { format: "HSL" }),
        onClick: () => handleCopy("hsl"),
        "aria-label": t("copyFormat", { format: "HSL" }),
      },
      {
        label: t("copyFormat", { format: "CMYK" }),
        onClick: () => handleCopy("cmyk"),
        "aria-label": t("copyFormat", { format: "CMYK" }),
      },
    ];

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(
          "group focus-within:outline-focus-indicator relative flex items-center justify-center overflow-hidden focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-none",
          className,
        )}
        role="listitem"
        aria-label={t_accessibility("colorSwatchLabel", { hex: hexValue })}
        dir="ltr" // Explicitly set for RTL support
      >
        <div
          {...listeners}
          className={cn("absolute inset-0", {
            "pointer-events-none": !listeners?.onPointerDown,
          })}
          style={{
            cursor: isLocked ? "default" : isDragging ? "grabbing" : "grab",
          }}
          aria-label={
            isLocked
              ? t("dragDisabledLabel")
              : t("dragEnabledLabel", { color: hexValue })
          }
        />
        <div
          className={cn(
            "bg-overlay-dark-alpha-30 pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none",
            { "p-1": viewMode === "compact", "p-4": viewMode === "full" },
          )}
        >
          <Button
            tooltipContent={t("copyHexLabel", { hexValue })}
            variant="none"
            size="icon"
            ref={buttonRef}
            className={cn(
              "text-background-page focus-visible:ring-background-page bg-overlay-dark-alpha-60 hover:bg-overlay-dark-alpha-80 focus-visible:ring-offset-overlay-dark-alpha-50 pointer-events-auto rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              {
                "mb-1 px-1.5 py-0.5 text-xs font-medium":
                  viewMode === "compact",
                "mb-4 px-3 py-1.5 text-base font-semibold": viewMode === "full",
              },
            )}
            onClick={() => handleCopy("hex")}
            aria-label={t("copyHexLabel", { hexValue })}
          >
            {hexValue.toUpperCase()}
          </Button>
          <div
            className={cn("pointer-events-auto flex items-center", {
              "space-x-1": viewMode === "compact",
              "space-x-2": viewMode === "full",
            })}
            dir="ltr"
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
                aria-label={
                  isLocked ? t_controls("unlock") : t_controls("lock")
                }
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
              ariaLabel={t_controls("copy", {
                defaultValue: "Copy color options",
              })}
              trigger={
                <Button
                  variant="none"
                  size="icon"
                  className={cn(
                    "text-background-page focus-visible:ring-background-page bg-overlay-dark-alpha-50 hover:bg-overlay-dark-alpha-70 inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2",
                    {
                      "p-1.5": viewMode === "compact",
                      "p-2": viewMode === "full",
                    },
                  )}
                  aria-label={t_controls("copy", {
                    defaultValue: "Copy color",
                  })}
                  aria-haspopup="menu"
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
            />
          </div>
        </div>
      </div>
    );
  },
);
