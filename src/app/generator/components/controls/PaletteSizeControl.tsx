// app/generator/components/controls/PaletteSizeControl.tsx
import React from "react";
import { Button } from "@components/Button";
import { FiPlus, FiMinus } from "react-icons/fi";
import { MaxPaletteSize, MinPaletteSize } from "@typings/PaletteState";

interface PaletteSizeControlProps {
  paletteSize: number;
  onSizeChange: (newSize: number) => void;
  decreaseSizeLabel: string;
  increaseSizeLabel: string;
  minSize?: number;
  maxSize?: number;
}

export const PaletteSizeControl: React.FC<PaletteSizeControlProps> = ({
  paletteSize,
  onSizeChange,
  decreaseSizeLabel,
  increaseSizeLabel,
  minSize = MinPaletteSize, // Default min size
  maxSize = MaxPaletteSize, // Default max size
}) => {
  return (
    <div className="border-border-divider flex items-center gap-1 rounded-md border p-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onSizeChange(paletteSize - 1)}
        aria-label={decreaseSizeLabel}
        disabled={paletteSize <= minSize}
      >
        <FiMinus className="h-5 w-5" />
      </Button>
      <span className="w-6 text-center text-sm font-medium" aria-live="polite">
        {paletteSize}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onSizeChange(paletteSize + 1)}
        aria-label={increaseSizeLabel}
        disabled={paletteSize >= maxSize}
      >
        <FiPlus className="h-5 w-5" />
      </Button>
    </div>
  );
};
