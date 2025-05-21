// app/components/HomePage/HowItWorksSection.tsx
import React from "react";
import { FiPlayCircle, FiSettings, FiShare2 } from "react-icons/fi";
import { HowItWorksStep } from "./HowItWorksStep";
import { createTranslator } from "next-intl";

interface HowItWorksSectionProps {
  tHowItWorks: ReturnType<typeof createTranslator>;
}

const stepsData = [
  {
    id: "step1",
    icon: FiPlayCircle,
    titleKey: "step1Title",
    descriptionKey: "step1Description",
  },
  {
    id: "step2",
    icon: FiSettings,
    titleKey: "step2Title",
    descriptionKey: "step2Description",
  },
  {
    id: "step3",
    icon: FiShare2,
    titleKey: "step3Title",
    descriptionKey: "step3Description",
  },
];

export function HowItWorksSection({ tHowItWorks }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="mb-8 w-full md:mb-12">
      <h2 className="mb-12 text-center">{tHowItWorks("title")}</h2>
      <div className="grid grid-cols-1 gap-8 px-6 text-center md:grid-cols-3">
        {stepsData.map((step) => (
          <HowItWorksStep
            key={step.id}
            icon={step.icon}
            title={tHowItWorks(step.titleKey)}
            description={tHowItWorks(step.descriptionKey)}
          />
        ))}
      </div>
    </section>
  );
}
