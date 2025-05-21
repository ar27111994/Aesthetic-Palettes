// app/generator/components/PaletteControls.tsx
import React from "react";
import { useTranslations } from "next-intl";
import { ViewOptions } from "./controls/ViewOptions";
import { GenerateControl } from "./controls/GenerateControl";
import { UndoRedoControl } from "./controls/UndoRedoControl";
import { PaletteSizeControl } from "./controls/PaletteSizeControl";
import {
  MoreOptionsDropdown,
  MoreOptionsSectionConfig,
} from "./controls/MoreOptionsDropdown";
import {
  FiShare2,
  FiEye,
  FiImage,
  FiZap,
  FiSliders,
  FiEdit3,
  FiSave,
  FiGrid,
} from "react-icons/fi";

interface PaletteControlsProps {
  onGenerate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  paletteSize: number;
  onSizeChange: (newSize: number) => void;

  // Handlers for "More Options" items
  onGenerateFromImage: () => void;
  onGenerateWithAI: () => void;
  onApplyHarmonyRule: () => void;
  onViewShadesTints: () => void;
  onCreateGradient: () => void;
  onSave: () => void;
  onExport: () => void;
  onViewOptions: () => void; // Placeholder, actual ViewOptions is separate
  onAccessibilityTools: () => void;
}

export const PaletteControls: React.FC<PaletteControlsProps> = ({
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
  onViewOptions, // This handler is for the "View Options" item *within* the MoreOptionsDropdown
  onAccessibilityTools,
}) => {
  const t_page = useTranslations("PaletteGenerator"); // For "generateButton"
  const t_controls = useTranslations("Controls"); // For control labels

  // Configuration for the MoreOptionsDropdown
  const moreOptionsSections: MoreOptionsSectionConfig[] = [
    {
      id: "generation",
      items: [
        {
          id: "gen-image",
          label: t_controls("generateFromImage"),
          icon: FiImage,
          handler: onGenerateFromImage,
        },
        {
          id: "gen-ai",
          label: t_controls("generateWithAI"),
          icon: FiZap,
          handler: onGenerateWithAI,
        },
      ],
    },
    {
      id: "tools",
      items: [
        {
          id: "harmony",
          label: t_controls("applyHarmonyRule"),
          icon: FiSliders,
          handler: onApplyHarmonyRule,
        },
        {
          id: "shades",
          label: t_controls("viewShadesTints"),
          icon: FiGrid,
          handler: onViewShadesTints,
        },
        {
          id: "gradient",
          label: t_controls("createGradient"),
          icon: FiEdit3,
          handler: onCreateGradient,
        },
      ],
    },
    {
      id: "manage",
      items: [
        {
          id: "save",
          label: t_controls("save"),
          icon: FiSave,
          handler: onSave,
        },
        {
          id: "export",
          label: t_controls("export"),
          icon: FiShare2,
          handler: onExport,
        },
      ],
    },
    {
      id: "display",
      items: [
        // The ViewOptions component is separate, this is if you want a menu item for it too
        {
          id: "view-opts",
          label: t_controls("viewOptions"),
          icon: FiEye,
          handler: onViewOptions,
        },
        {
          id: "a11y-tools",
          label: t_controls("accessibilityTools"),
          icon: FiSliders,
          handler: onAccessibilityTools,
        },
      ],
    },
  ];

  return (
    <div className="border-border-divider bg-background-subtle flex flex-wrap items-center justify-center gap-2 border-t p-4 sm:gap-4">
      {/* Generate Button */}
      <GenerateControl
        onGenerate={onGenerate}
        translator={t_page}
        translatorNamespace="generateButton"
      />

      {/* Undo/Redo Buttons */}
      <UndoRedoControl
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        undoLabel={t_controls("undo")}
        redoLabel={t_controls("redo")}
      />

      {/* Palette Size Adjuster */}
      <PaletteSizeControl
        paletteSize={paletteSize}
        onSizeChange={onSizeChange}
        decreaseSizeLabel={t_controls("decreaseSize")}
        increaseSizeLabel={t_controls("increaseSize")}
        // minSize and maxSize are using defaults
      />

      {/* More Options Button -> Menu */}
      <MoreOptionsDropdown
        sections={moreOptionsSections}
        moreOptionsLabel={t_controls("moreOptions")}
      />

      {/* ViewOptions Component (as per original structure) */}
      <div className="ml-4">
        <ViewOptions />
      </div>
    </div>
  );
};
