// app/components/HomePage/PalettePreview/PalettePreviewContainer.tsx
import React from "react";
import Link from "next/link";
import { PalettePreviewData } from "@hooks/usePalettePreview";
import { LaptopPalettePreview } from "./LaptopPalettePreview";
import { MobilePalettePreview } from "./MobilePalettePreview";
import { DecorativeCircles } from "./DecorativeCircles";
import { createTranslator } from "next-intl";

interface PalettePreviewContainerProps {
  palettePreviewData: PalettePreviewData;
  tHome: ReturnType<typeof createTranslator>;
  tAccessibility: ReturnType<typeof createTranslator>;
}

export function PalettePreviewContainer({
  palettePreviewData,
  tHome,
  tAccessibility,
}: PalettePreviewContainerProps) {
  return (
    <Link
      target="_blank"
      href="/generator"
      passHref
      className="animate-fade-in animation-delay-200 group relative flex flex-col items-center justify-center transition-transform duration-500 hover:scale-[1.02] motion-reduce:transition-none"
    >
      <LaptopPalettePreview
        samplePalette={palettePreviewData.samplePalette}
        tAccessibility={tAccessibility}
      />
      <MobilePalettePreview tHome={tHome} tAccessibility={tAccessibility} />
      <DecorativeCircles decorators={palettePreviewData.decorators} />
    </Link>
  );
}
