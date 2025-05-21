// app/components/HomePage/HeroSection.tsx
import React from "react";
import Link from "next/link";
import { Button } from "@components/Button";
import { PalettePreviewContainer } from "./PalettePreview/PalettePreviewContainer";
import { PalettePreviewData } from "@hooks/usePalettePreview";
import { createTranslator } from "next-intl";

interface HeroSectionProps {
  tHome: ReturnType<typeof createTranslator>;
  tAccessibility: ReturnType<typeof createTranslator>;
  palettePreviewData: PalettePreviewData;
}

export function HeroSection({
  tHome,
  tAccessibility,
  palettePreviewData,
}: HeroSectionProps) {
  return (
    <section className="relative grid w-full grid-cols-1 items-center gap-6 overflow-hidden p-6 sm:gap-12 md:p-10 lg:grid-cols-2 lg:gap-0 lg:p-16">
      {/* Text Content & CTAs */}
      <div className="animate-fade-up order-1 text-center lg:order-0">
        <h1 className="text-text-heading mb-5 text-4xl md:text-5xl lg:text-6xl">
          {tHome("heroTitle")}
        </h1>
        <p className="text-text-secondary mb-10 text-lg font-semibold">
          {tHome("heroSubtitle")}
        </p>
        <div className="mb-6 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/generator" passHref>
            <Button
              variant="primary"
              size="lg"
              className="focus-visible:ring-focus-indicator w-full transform shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:brightness-105 focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none sm:w-auto"
            >
              {tHome("launchGeneratorButton")}
            </Button>
          </Link>
          <Link href="/explore" passHref>
            <Button
              variant="outline"
              size="lg"
              className="focus-visible:ring-focus-indicator w-full transform shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:brightness-105 focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none sm:w-auto"
            >
              {tHome("explorePalettesButton")}
            </Button>
          </Link>
        </div>
        <p className="text-sm">
          {tHome.rich("generatorHint", {
            key: (chunks: React.ReactNode) => (
              <code className="bg-background-subtle rounded p-1 font-mono uppercase">
                {chunks}
              </code>
            ),
          })}
        </p>
      </div>

      {/* Visual Palette Preview */}
      <PalettePreviewContainer
        palettePreviewData={palettePreviewData}
        tHome={tHome}
        tAccessibility={tAccessibility}
      />
    </section>
  );
}
