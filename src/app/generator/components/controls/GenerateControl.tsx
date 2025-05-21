// app/generator/components/controls/GenerateControl.tsx
import React from "react";
import { Button } from "@components/Button";
import { createTranslator } from "next-intl";

interface GenerateControlProps {
  onGenerate: () => void;
  translator: ReturnType<typeof createTranslator>;
  translatorNamespace: string;
}

export const GenerateControl: React.FC<GenerateControlProps> = ({
  onGenerate,
  translator,
  translatorNamespace,
}) => {
  return (
    <Button variant="primary" onClick={onGenerate} aria-keyshortcuts="Space">
      {translator.rich(translatorNamespace, {
        key: (chunks: React.ReactNode) => (
          <span className="ml-2 hidden text-xs opacity-75 sm:block">
            {chunks}
          </span>
        ),
      })}
    </Button>
  );
};
