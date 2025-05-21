// app/components/HomePage/TrendingSection.tsx
import React from "react";
import Link from "next/link";
import { Button } from "@components/Button";
import { createTranslator } from "next-intl";

interface TrendingSectionProps {
  tHome: ReturnType<typeof createTranslator>;
}

export function TrendingSection({ tHome }: TrendingSectionProps) {
  return (
    <section id="trending" className="mb-8 w-full px-8 md:mb-8 md:px-12">
      <h2 className="mb-12 text-center">{tHome("trendingTitle")}</h2>
      {/* Placeholder for Palette Card Grid/Carousel - Requires component */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-background-subtle text-text-secondary h-40 content-center rounded-lg text-center">
          {tHome("paletteCardPlaceholder", { number: 1 })}
        </div>
        <div className="bg-background-subtle text-text-secondary h-40 content-center rounded-lg text-center">
          {tHome("paletteCardPlaceholder", { number: 2 })}
        </div>
        <div className="bg-background-subtle text-text-secondary h-40 content-center rounded-lg text-center">
          {tHome("paletteCardPlaceholder", { number: 3 })}
        </div>
        <div className="bg-background-subtle text-text-secondary h-40 content-center rounded-lg text-center">
          {tHome("paletteCardPlaceholder", { number: 4 })}
        </div>
      </div>
      <div className="text-center">
        <Link href="/explore?sort=trending" passHref>
          <Button
            className="text-accent hover:text-primary-action-hover"
            variant="ghost"
            size="lg"
          >
            {tHome("viewMoreTrendingButton")}
          </Button>
        </Link>
      </div>
    </section>
  );
}
