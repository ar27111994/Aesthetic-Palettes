// app/page.tsx
"use client"; // Add use client for hooks

import React from "react";
import { useTranslations } from "next-intl"; // Import useTranslations
import { usePalettePreview } from "@hooks/usePalettePreview";
import { HeroSection } from "@components/HomePage/HeroSection";
import { FeaturesSection } from "@components/HomePage/FeaturesSection";
import { TrendingSection } from "@components/HomePage/TrendingSection";
import { AccessibilitySection } from "@components/HomePage/AccessibilitySection";
import { HowItWorksSection } from "@components/HomePage/HowItWorksSection";
import { TestimonialsSection } from "@components/HomePage/TestimonialsSection";
import { CtaSection } from "@components/HomePage/CtaSection";

// Constants for palette preview hook
const PALETTE_UPDATE_DELAY = 700; // Faster palette updates for faster preview
const LAPTOP_PALETTE_SIZE = 6; // Number of colors for the laptop preview

export default function HomePage() {
  const tHome = useTranslations("HomePage"); // Initialize translations for general HomePage text
  const tFeatures = useTranslations("Features"); // Separate namespace for features
  const tAccessibility = useTranslations("Accessibility"); // Separate namespace for accessibility
  const tHowItWorks = useTranslations("HowItWorks"); // Separate namespace for how it works
  const tCta = useTranslations("CTA"); // Separate namespace for Call To Action
  const tTestimonials = useTranslations("Testimonials"); // Separate namespace for testimonials

  // Use the custom hook for palette preview logic
  const palettePreviewData = usePalettePreview({
    paletteSize: LAPTOP_PALETTE_SIZE,
    updateDelay: PALETTE_UPDATE_DELAY,
  });

  return (
    <main
      id="main-content"
      className="border-b-border-divider flex min-h-screen flex-col items-center border-b"
    >
      {/* Hero Section */}
      <HeroSection
        tHome={tHome}
        tAccessibility={tAccessibility}
        palettePreviewData={palettePreviewData}
      />

      {/* Feature Highlights Section */}
      <FeaturesSection tHome={tHome} tFeatures={tFeatures} />

      {/* Trending Palettes Preview Section */}
      <TrendingSection tHome={tHome} />

      {/* Accessibility Focus Section */}
      <AccessibilitySection tAccessibility={tAccessibility} />

      {/* How it Works Section */}
      <HowItWorksSection tHowItWorks={tHowItWorks} />

      {/* Testimonials (Social Proof) Section */}
      <TestimonialsSection tTestimonials={tTestimonials} />

      {/* Call to Action (Account) Section */}
      <CtaSection tCta={tCta} />
    </main>
  );
}
