// app/generator/page.tsx
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
import { PaletteDisplay } from "@generator/components/PaletteDisplay";
import { PaletteControls } from "@generator/components/PaletteControls";

// Main Page Component
const PaletteGeneratorPage: React.FC = () => {
  // Use custom hook for palette state and actions
  const {
    items,
    lockedIndices,
    layout,
    // viewMode, // viewMode is used by useFullscreenOnViewModeToggle, not directly here
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
  // This hook internally listens for 'palette/toggleViewMode' action
  useFullscreenOnViewModeToggle();

  // Dnd-kit setup: Sensors for input methods
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Drag end handler for reordering palette items
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id && over?.id) {
      // Ensure over.id is not null
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Dispatch the reorderPalette action with old and new indices
        dispatchReorderPalette({ oldIndex, newIndex });
      }
    }
  }

  // Placeholder handler for adjusting a color
  const handleAdjust = (color: string) => {
    console.log("Adjust color:", color);
    // TODO: Open adjustment modal
  };

  // --- Placeholder handlers for "More Options" items ---
  // These remain in the page component as they might trigger UI changes (modals, etc.)
  // specific to this page's context.
  const handleGenerateFromImage = () => console.log("Open Image Upload Modal");
  const handleGenerateWithAI = () => console.log("Open AI Prompt Modal");
  const handleApplyHarmonyRule = () =>
    console.log("Open Color Harmony Rules Modal");
  const handleViewShadesTints = () => console.log("Open Shades/Tints Modal");
  const handleCreateGradient = () =>
    console.log("Open Gradient Generator Modal");
  const handleSave = () => {
    console.log("Open Save Palette modal");
    // TODO: Implement Save modal (requires login)
  };
  const handleExport = () => {
    console.log("Open Export Palette modal");
    // TODO: Implement Export modal
  };
  const handleViewOptions = () => {
    console.log("Open View Options from menu item"); // This is for the menu item
    // TODO: Implement view options toggle or modal if different from the dedicated ViewOptions component
  };
  const handleAccessibilityTools = () => {
    console.log("Open Accessibility Tools modal");
    // TODO: Implement Accessibility modal
  };
  // --- End of Placeholder Handlers ---

  return (
    <div className="flex h-screen flex-col">
      {/* Main Palette Area */}
      <PaletteDisplay
        items={items}
        layout={layout}
        lockedIndices={lockedIndices}
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onLockToggle={dispatchToggleLock}
        onAdjust={handleAdjust} // Keep original non-dispatch handler
        onDelete={dispatchDeleteColor}
      />

      {/* Global Controls Bar */}
      <PaletteControls
        onGenerate={dispatchGenerate}
        onUndo={dispatchUndo}
        onRedo={dispatchRedo}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        paletteSize={paletteSize}
        onSizeChange={dispatchSetPaletteSize}
        // Pass down "More Options" handlers
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
