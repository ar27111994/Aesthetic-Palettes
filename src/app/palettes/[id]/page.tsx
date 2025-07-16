// app/palettes/[id]/page.tsx
"use client";

import React from "react";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { usePaletteManagement } from "@hooks/usePaletteManagement";
import { useFullscreenOnViewModeToggle } from "@hooks/useFullscreenOnViewModeToggle";
import { PaletteDisplay } from "@palettes/[id]/components/PaletteDisplay";
import { PaletteControls } from "@palettes/[id]/components/PaletteControls";
import { MinPaletteSize, MaxPaletteSize } from "@typings/PaletteState";

/**
 * PaletteGeneratorPage component renders the main palette generator interface.
 * It manages palette state, drag-and-drop functionality, and integrates fullscreen toggling.
 * @component
 * @returns {JSX.Element} The rendered PaletteGeneratorPage component.
 */
const PaletteGeneratorPage: React.FC = () => {
  const {
    items,
    lockedIndices,
    layout,
    past,
    future,
    paletteSize,
    dispatchGenerate,
    dispatchToggleLock,
    dispatchDeleteColor,
    dispatchReorderPalette,
    dispatchUndo,
    dispatchRedo,
    dispatchSetPaletteSize,
  } = usePaletteManagement();

  // Initialize fullscreen toggle hook
  useFullscreenOnViewModeToggle();

  // Dnd-kit setup: Sensors for input methods
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Handle drag end for reordering palette items
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        dispatchReorderPalette({ oldIndex, newIndex });
      }
    }
  };

  // Handle color adjustment
  const handleAdjust = (color: string) => {
    // TODO: Implement adjustment modal with color picker
  };

  // Handlers for "More Options" items
  const handleGenerateFromImage = () => {
    // TODO: Implement image upload modal for palette generation
  };

  const handleGenerateWithAI = () => {
    // TODO: Implement AI prompt modal for palette generation
  };

  const handleApplyHarmonyRule = () => {
    // TODO: Implement color harmony rules modal
  };

  const handleViewShadesTints = () => {
    // TODO: Implement shades/tints modal
  };

  const handleCreateGradient = () => {
    // TODO: Implement gradient generator modal
  };

  const handleSave = () => {
    // TODO: Implement save palette modal (requires authentication)
  };

  const handleExport = () => {
    // TODO: Implement export palette modal
  };

  const handleViewOptions = () => {
    // TODO: Implement view options modal or toggle
  };

  const handleAccessibilityTools = () => {
    // TODO: Implement accessibility tools modal
  };

  // Validate and dispatch palette size changes
  const handleSizeChange = (newSize: number) => {
    if (newSize >= MinPaletteSize && newSize <= MaxPaletteSize) {
      dispatchSetPaletteSize(newSize);
    }
  };

  return (
    <div
      className="flex h-screen flex-col"
      role="main"
      aria-label="Palette Generator"
    >
      <PaletteDisplay
        items={items}
        layout={layout}
        lockedIndices={lockedIndices}
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onLockToggle={dispatchToggleLock}
        onAdjust={handleAdjust}
        onDelete={dispatchDeleteColor}
      />
      <PaletteControls
        onGenerate={dispatchGenerate}
        onUndo={dispatchUndo}
        onRedo={dispatchRedo}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        paletteSize={paletteSize}
        onSizeChange={handleSizeChange}
        onGenerateFromImage={handleGenerateFromImage}
        onGenerateWithAI={handleGenerateWithAI}
        onApplyHarmonyRule={handleApplyHarmonyRule}
        onViewShadesTints={handleViewShadesTints}
        onCreateGradient={handleCreateGradient}
        onSave={handleSave}
        onExport={handleExport}
        onViewOptions={handleViewOptions}
        onAccessibilityTools={handleAccessibilityTools}
      />
    </div>
  );
};

export default PaletteGeneratorPage;
