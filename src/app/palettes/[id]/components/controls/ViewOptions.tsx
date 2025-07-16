// app/palettes/[id]/components/controls/ViewOptions.tsx
"use client";

import React, { useEffect, useCallback } from "react";
import { RootState } from "@lib/store";
import { toggleLayout, toggleViewMode } from "@features/palette/paletteSlice";
import { Button } from "@components/Button";
import { Tooltip } from "@components/Tooltip";
import { FiGrid, FiMenu, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { PaletteState } from "@typings/PaletteState";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@hooks/useApp";
import { useHotkeys } from "react-hotkeys-hook";
import { useAriaAnnouncer } from "@lib/hooks/useAriaAnnouncer";

/**
 * ViewOptions component renders controls for toggling layout and view mode.
 * @component
 * @returns {JSX.Element} The rendered ViewOptions component.
 */
export const ViewOptions: React.FC = () => {
  const dispatch = useAppDispatch();
  const announce = useAriaAnnouncer();
  const { layout, viewMode } = useAppSelector(
    (state: RootState) => state.palette as PaletteState,
  );
  const t = useTranslations("Controls");

  const handleToggleLayout = useCallback(() => {
    const newLayout = layout === "horizontal" ? "vertical" : "horizontal";
    dispatch(toggleLayout);
    announce(
      t("layoutChanged", {
        layout: t(`${newLayout}Layout`, {
          defaultValue: `${newLayout} layout`,
        }),
      }),
    );
  }, [dispatch, layout, t, announce]);

  const handleToggleViewMode = useCallback(() => {
    const newViewMode = viewMode === "compact" ? "full" : "compact";
    dispatch(toggleViewMode);
    announce(
      t(`${newViewMode}ViewEnabled`, {
        defaultValue: `${newViewMode} view enabled`,
      }),
    );
  }, [dispatch, viewMode, t, announce]);

  useHotkeys("l", handleToggleLayout, { enabled: true, preventDefault: true }, [
    handleToggleLayout,
  ]);
  useHotkeys(
    "f",
    handleToggleViewMode,
    {
      enabled: true,
      preventDefault: true,
      enableOnFormTags: ["input", "textarea"],
    },
    [handleToggleViewMode],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && viewMode === "full") {
        handleToggleViewMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, handleToggleViewMode]);

  const layoutLabel = t(
    layout === "horizontal"
      ? "switchToVerticalLayout"
      : "switchToHorizontalLayout",
    {
      defaultValue:
        layout === "horizontal"
          ? "Switch to vertical layout"
          : "Switch to horizontal layout",
    },
  );
  const viewModeLabel = t(
    viewMode === "compact" ? "enterFullscreen" : "exitFullscreen",
    {
      defaultValue:
        viewMode === "compact" ? "Enter fullscreen" : "Exit fullscreen",
    },
  );

  return (
    <div
      className="bg-background-subtle flex gap-2 rounded-lg p-1"
      role="toolbar"
      aria-label={t("viewOptions", { defaultValue: "View options" })}
      aria-controls="palette-container"
    >
      <Tooltip content={`${layoutLabel} (L)`} side="bottom">
        <Button
          variant="ghost"
          size="icon"
          aria-label={layoutLabel}
          aria-pressed={layout === "vertical"}
          onClick={handleToggleLayout}
          className="focus:ring-primary/50 transition-transform hover:scale-105 focus:ring-2 focus:ring-offset-2"
        >
          {layout === "horizontal" ? (
            <FiMenu className="h-5 w-5" aria-hidden="true" />
          ) : (
            <FiGrid className="h-5 w-5" aria-hidden="true" />
          )}
          <span className="sr-only">{layoutLabel}</span>
        </Button>
      </Tooltip>
      <Tooltip content={`${viewModeLabel} (F)`} side="bottom">
        <Button
          variant="ghost"
          size="icon"
          aria-label={viewModeLabel}
          aria-pressed={viewMode === "full"}
          onClick={handleToggleViewMode}
          className="focus:ring-primary/50 transition-transform hover:scale-105 focus:ring-2 focus:ring-offset-2"
        >
          {viewMode === "compact" ? (
            <FiMaximize2 className="h-5 w-5" aria-hidden="true" />
          ) : (
            <FiMinimize2 className="h-5 w-5" aria-hidden="true" />
          )}
          <span className="sr-only">{viewModeLabel}</span>
        </Button>
      </Tooltip>
    </div>
  );
};

export default ViewOptions;
