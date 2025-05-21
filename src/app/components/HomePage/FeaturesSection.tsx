// app/components/HomePage/FeaturesSection.tsx
import React from "react";
import {
  FiAward,
  FiCpu,
  FiImage,
  FiUsers,
  FiSave,
  FiDollarSign,
} from "react-icons/fi";
import { FeatureCard } from "./FeatureCard";
import { createTranslator } from "next-intl";

interface FeaturesSectionProps {
  tHome: ReturnType<typeof createTranslator>;
  tFeatures: ReturnType<typeof createTranslator>;
}

const featuresData = [
  {
    id: "wcag",
    icon: FiAward,
    titleKey: "wcagTitle",
    descriptionKey: "wcagDescription",
  },
  {
    id: "ai",
    icon: FiCpu,
    titleKey: "aiTitle",
    descriptionKey: "aiDescription",
  },
  {
    id: "image",
    icon: FiImage,
    titleKey: "imageTitle",
    descriptionKey: "imageDescription",
  },
  {
    id: "collab",
    icon: FiUsers,
    titleKey: "collabTitle",
    descriptionKey: "collabDescription",
  },
  {
    id: "saves",
    icon: FiSave,
    titleKey: "savesTitle",
    descriptionKey: "savesDescription",
  },
  {
    id: "cost",
    icon: FiDollarSign,
    titleKey: "costTitle",
    descriptionKey: "costDescription",
  },
];

export function FeaturesSection({ tHome, tFeatures }: FeaturesSectionProps) {
  return (
    <section
      id="features"
      className="bg-background-subtle mb-8 w-full py-8 shadow-inner md:mb-12 md:py-12"
    >
      <h2 className="mb-12 text-center">{tHome("featuresTitle")}</h2>
      <div className="grid grid-cols-1 gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">
        {featuresData.map((feature) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={tFeatures(feature.titleKey)}
            description={tFeatures(feature.descriptionKey)}
          />
        ))}
      </div>
    </section>
  );
}
