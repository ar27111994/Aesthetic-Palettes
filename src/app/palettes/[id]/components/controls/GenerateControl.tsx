// app/palettes/[id]/components/controls/GenerateControl.tsx
import React, { memo } from "react";
import { Button } from "@components/Button";
import { useTranslations } from "next-intl";

/**
 * Props for the GenerateControl component.
 * @interface GenerateControlProps
 */
interface GenerateControlProps {
  onGenerate: () => void;
}

/**
 * GenerateControl component renders a button to trigger palette generation.
 * @component
 * @param {GenerateControlProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered GenerateControl component.
 */
export const GenerateControl: React.FC<GenerateControlProps> = memo(
  ({ onGenerate }) => {
    const t = useTranslations("PaletteGenerator");

    return (
      <Button
        variant="primary"
        onClick={onGenerate}
        aria-keyshortcuts="Space"
        aria-describedby="generate-button-description"
      >
        {t("generateButton", { defaultValue: "Generate Palette" })}
        <span id="generate-button-description" className="sr-only">
          {t("generateButtonDescription", {
            defaultValue: "Generate a new color palette",
          })}
        </span>
      </Button>
    );
  },
);

GenerateControl.displayName = "GenerateControl";
