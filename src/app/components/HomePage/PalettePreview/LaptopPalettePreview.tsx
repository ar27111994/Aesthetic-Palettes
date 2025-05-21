// app/components/HomePage/PalettePreview/LaptopPalettePreview.tsx
import React from "react";
import { FiDisc, FiTarget } from "react-icons/fi";
import { ColorSwatch } from "@typings/PaletteState";
import { createTranslator } from "next-intl";

interface LaptopPalettePreviewProps {
  samplePalette: ColorSwatch[];
  tAccessibility: ReturnType<typeof createTranslator>;
}

export function LaptopPalettePreview({
  samplePalette,
  tAccessibility,
}: LaptopPalettePreviewProps) {
  return (
    <>
      {/* Visual Palette Preview - Laptop */}
      <div className="border-background-dark-1 bg-background-dark-1 relative hidden aspect-[14.01/9.77] h-full w-[80%] rounded-t-2xl border-18 sm:flex">
        {/* Webcam Overlay */}
        <div className="bg-disabled-control/30 text-text-secondary absolute -top-[15.5px] left-[40%] flex h-3.5 w-[20%] flex-row items-center justify-between rounded-2xl px-2 py-1 text-center">
          <FiDisc className="text-[10px]" aria-hidden="true" />
          <FiTarget className="text-xs" aria-hidden="true" />
          <FiDisc className="text-[10px]" aria-hidden="true" />
        </div>
        {/* Stacked Bars */}
        <div className="palette-preview flex w-full">
          {samplePalette?.map((color, index) => (
            <div
              key={index}
              className="not-last:border-border-divider/15 h-full flex-1 transition-colors duration-500 ease-in-out not-last:border-r-[0.15px] first:rounded-tl-md last:rounded-tr-md hover:opacity-90 motion-reduce:transition-none"
              style={{ backgroundColor: color.value }}
              aria-label={tAccessibility("colorSwatchLabel", {
                hex: color.value,
              })}
            ></div>
          ))}
        </div>
      </div>
      <div className="bg-background-overlay-light-alpha-80 relative hidden h-6 w-full content-center rounded-b-4xl shadow-2xl backdrop-blur-sm backdrop-brightness-110 group-hover:shadow-2xl sm:block dark:backdrop-brightness-100">
        <div className="bg-background-page/25 border-border-divider mr-8 ml-auto h-3 w-9 rounded-md border-1" />
      </div>
    </>
  );
}
