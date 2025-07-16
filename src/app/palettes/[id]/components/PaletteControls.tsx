// app/palettes/[id]/components/PaletteControls.tsx
import React, { memo } from "react";
import { useTranslations } from "next-intl";
import { ViewOptions } from "@palettes/[id]/components/controls/ViewOptions";
import { GenerateControl } from "@palettes/[id]/components/controls/GenerateControl";
import { UndoRedoControl } from "@palettes/[id]/components/controls/UndoRedoControl";
import { PaletteSizeControl } from "@palettes/[id]/components/controls/PaletteSizeControl";
import { MoreOptionsDropdown } from "@palettes/[id]/components/controls/MoreOptionsDropdown";
import { moreOptionsSections } from "@lib/constants/moreOptionsSections";

/**
 * Props for the PaletteControls component.
 * @interface PaletteControlsProps
 */
interface PaletteControlsProps {
  onGenerate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onViewOptions: () => void;
  canUndo: boolean;
  canRedo: boolean;
  paletteSize: number;
  onSizeChange: (newSize: number) => void;
  onGenerateFromImage: () => void;
  onGenerateWithAI: () => void;
  onApplyHarmonyRule: () => void;
  onViewShadesTints: () => void;
  onCreateGradient: () => void;
  onSave: () => void;
  onAccessibilityTools: () => void;
}

/**
 * PaletteControls component renders the control bar for palette actions.
 * @component
 * @param {PaletteControlsProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered PaletteControls component.
 */
export const PaletteControls: React.FC<PaletteControlsProps> = memo(
  ({
    onGenerate,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    paletteSize,
    onSizeChange,
    onGenerateFromImage,
    onGenerateWithAI,
    onApplyHarmonyRule,
    onViewShadesTints,
    onCreateGradient,
    onSave,
    onExport,
    onViewOptions,
    onAccessibilityTools,
  }) => {
    const t_controls = useTranslations("Controls");

    // Map handlers to menu items
    const menuItems = moreOptionsSections(t_controls, {
      onGenerateFromImage,
      onGenerateWithAI,
      onApplyHarmonyRule,
      onViewShadesTints,
      onCreateGradient,
      onSave,
      onExport,
      onViewOptions,
      onAccessibilityTools,
    });

    return (
      <div
        className="border-border-divider bg-background-subtle flex flex-wrap items-center justify-center gap-2 border-t p-4 sm:gap-4"
        role="toolbar"
        aria-label={t_controls("paletteControls", {
          defaultValue: "Palette controls",
        })}
      >
        <GenerateControl onGenerate={onGenerate} />
        <UndoRedoControl
          onUndo={onUndo}
          onRedo={onRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          undoLabel={t_controls("undo", { defaultValue: "Undo" })}
          redoLabel={t_controls("redo", { defaultValue: "Redo" })}
        />
        <PaletteSizeControl
          paletteSize={paletteSize}
          onSizeChange={onSizeChange}
          decreaseSizeLabel={t_controls("decreaseSize", {
            defaultValue: "Decrease palette size",
          })}
          increaseSizeLabel={t_controls("increaseSize", {
            defaultValue: "Increase palette size",
          })}
        />
        <MoreOptionsDropdown
          items={menuItems}
          moreOptionsLabel={t_controls("moreOptions", {
            defaultValue: "More options",
          })}
        />
        <div className="ml-4">
          <ViewOptions />
        </div>
      </div>
    );
  },
);

PaletteControls.displayName = "PaletteControls";
