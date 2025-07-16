// src/lib/constants/moreOptionsSections.ts
import { MenuItem } from "@lib/typings/Menu";
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
import { createTranslator } from "next-intl";

interface MoreOptionsHandlers {
  onGenerateFromImage: () => void;
  onGenerateWithAI: () => void;
  onApplyHarmonyRule: () => void;
  onViewShadesTints: () => void;
  onCreateGradient: () => void;
  onSave: () => void;
  onExport: () => void;
  onViewOptions: () => void;
  onAccessibilityTools: () => void;
}

/**
 * Generates menu items for the MoreOptionsDropdown with translations and handlers.
 * @param t - Translation function from next-intl.
 * @param handlers - Handlers for menu item actions.
 * @returns {MenuItem[]} Array of menu items.
 */
export const moreOptionsSections = (
  t: ReturnType<typeof createTranslator>,
  handlers: MoreOptionsHandlers,
): MenuItem[] => [
  {
    label: t("generateFromImage", { defaultValue: "Generate from Image" }),
    icon: FiImage,
    onClick: handlers.onGenerateFromImage,
  },
  {
    label: t("generateWithAI", { defaultValue: "Generate with AI" }),
    icon: FiZap,
    onClick: handlers.onGenerateWithAI,
  },
  { label: "generation", isSeparator: true },
  {
    label: t("applyHarmonyRule", { defaultValue: "Apply Harmony Rule" }),
    icon: FiSliders,
    onClick: handlers.onApplyHarmonyRule,
  },
  {
    label: t("viewShadesTints", { defaultValue: "View Shades/Tints" }),
    icon: FiGrid,
    onClick: handlers.onViewShadesTints,
  },
  {
    label: t("createGradient", { defaultValue: "Create Gradient" }),
    icon: FiEdit3,
    onClick: handlers.onCreateGradient,
  },
  { label: "tools", isSeparator: true },
  {
    label: t("save", { defaultValue: "Save Palette" }),
    icon: FiSave,
    onClick: handlers.onSave,
  },
  {
    label: t("export", { defaultValue: "Export Palette" }),
    icon: FiShare2,
    onClick: handlers.onExport,
  },
  { label: "manage", isSeparator: true },
  {
    label: t("viewOptions", { defaultValue: "View Options" }),
    icon: FiEye,
    onClick: handlers.onViewOptions,
  },
  {
    label: t("accessibilityTools", { defaultValue: "Accessibility Tools" }),
    icon: FiSliders,
    onClick: handlers.onAccessibilityTools,
  },
];
