// app/components/HomePage/PalettePreview/DecorativeCircles.tsx
import React from "react";

interface DecorativeCirclesProps {
  decorators: string[];
}

export function DecorativeCircles({ decorators }: DecorativeCirclesProps) {
  if (!decorators || decorators.length < 2) {
    // Ensure decorators are available to prevent errors
    return null;
  }
  return (
    <>
      {/* Optional: Simplified decorative elements */}
      <div
        className="animate-move-circle-1 gradient-pulse absolute -right-[5vw] -bottom-[calc(5vw-(--spacing(6)))] z-20 hidden h-[10vw] w-[10vw] rounded-full border-solid bg-gradient-to-br bg-blend-difference blur-lg transition-colors duration-500 motion-reduce:transition-none sm:block"
        style={
          {
            "--color-base": decorators[0],
            "--from": 0.1,
            "--to": 0.6,
          } as React.CSSProperties
        }
      />
      <div
        className="animate-move-circle-2 gradient-pulse absolute -top-[calc(4vw-9px)] left-2.5 z-20 hidden h-[8vw] w-[8vw] rounded-full border-solid bg-gradient-to-tl bg-blend-difference blur-lg transition-colors duration-500 motion-reduce:transition-none sm:block"
        style={
          {
            "--color-base": decorators[1],
            "--from": 0.1,
            "--to": 0.6,
          } as React.CSSProperties
        }
      />
    </>
  );
}
