"use client";

import React from "react";
import { RootState } from "@lib/store";
import { toggleLayout, toggleViewMode } from "@features/palette/paletteSlice"; // Import toggleViewMode
import { Button } from "@components/Button";
import {
  FiGrid, //ViewGrid
  FiMenu, //MenuAlt3
  FiMaximize2, //ArrowsExpand
  FiLayout, //ViewColumns
} from "react-icons/fi";
import { PaletteState } from "@typings/PaletteState";
import { useTranslations } from "next-intl"; // Import useTranslations
import { useAppDispatch, useAppSelector } from "@hooks/useApp";

export const ViewOptions = () => {
  const dispatch = useAppDispatch();
  const { layout, viewMode } = useAppSelector(
    (state: RootState) => state.palette as PaletteState,
  );
  const t = useTranslations("Controls"); // Use Controls translations

  return (
    <div className="bg-background-subtle flex gap-2 rounded-lg p-1">
      {/* Layout Toggle */}
      <Button
        variant="ghost"
        size="icon"
        aria-label={t(
          layout === "horizontal" ? "verticalLayout" : "horizontalLayout",
        )}
        onClick={() => dispatch(toggleLayout())}
      >
        {layout === "horizontal" ? (
          <FiMenu className="h-5 w-5" />
        ) : (
          <FiGrid className="h-5 w-5" />
        )}
      </Button>

      {/* View Mode Toggle */}
      <Button
        variant="ghost"
        size="icon"
        aria-label={t(viewMode === "compact" ? "fullView" : "compactView")}
        onClick={() => dispatch(toggleViewMode())}
      >
        {viewMode === "compact" ? (
          <FiMaximize2 className="h-5 w-5" /> // Icon for switching to full
        ) : (
          <FiLayout className="h-5 w-5" /> // Icon for switching to compact
        )}
      </Button>
    </div>
  );
};
