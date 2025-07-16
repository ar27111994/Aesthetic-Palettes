// app/palettes/[id]/components/controls/PaletteSizeControl.tsx
import React, { memo } from "react";
import { Button } from "@components/Button";
import { FiPlus, FiMinus } from "react-icons/fi";
import { MinPaletteSize, MaxPaletteSize } from "@typings/PaletteState";

/**
 * Props for the PaletteSizeControl component.
 * @interface PaletteSizeControlProps
 */
interface PaletteSizeControlProps {
  paletteSize: number;
  onSizeChange: (newSize: number) => void;
  decreaseSizeLabel: string;
  increaseSizeLabel: string;
  minSize?: number;
  maxSize?: number;
}

/**
 * PaletteSizeControl component allows users to adjust the palette size.
 * @component
 * @param {PaletteSizeControlProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered PaletteSizeControl component.
 */
export const PaletteSizeControl: React.FC<PaletteSizeControlProps> = memo(
  ({
    paletteSize,
    onSizeChange,
    decreaseSizeLabel,
    increaseSizeLabel,
    minSize = MinPaletteSize,
    maxSize = MaxPaletteSize,
  }) => {
    // Validate size before dispatching
    const handleSizeChange = (newSize: number) => {
      if (newSize >= minSize && newSize <= maxSize) {
        onSizeChange(newSize);
      }
    };

    return (
      <div
        className="border-border-divider flex items-center gap-1 rounded-md border p-1"
        role="group"
        aria-label="Palette size control"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleSizeChange(paletteSize - 1)}
          aria-label={decreaseSizeLabel}
          disabled={paletteSize <= minSize}
        >
          <FiMinus className="h-5 w-5" aria-hidden="true" />
        </Button>
        <span
          className="w-6 text-center text-sm font-medium"
          aria-live="polite"
          id="palette-size"
        >
          {paletteSize}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleSizeChange(paletteSize + 1)}
          aria-label={increaseSizeLabel}
          disabled={paletteSize >= maxSize}
        >
          <FiPlus className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    );
  },
);

PaletteSizeControl.displayName = "PaletteSizeControl";
