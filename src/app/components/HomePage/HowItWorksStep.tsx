// app/components/HomePage/HowItWorksStep.tsx
import React from "react";

interface HowItWorksStepProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export function HowItWorksStep({
  icon: Icon,
  title,
  description,
}: HowItWorksStepProps) {
  return (
    <div>
      <div className="text-accent mb-4 justify-items-center text-5xl">
        <Icon aria-hidden="true" />
      </div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}
