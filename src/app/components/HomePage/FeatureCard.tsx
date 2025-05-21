// app/components/HomePage/FeatureCard.tsx
import React from "react";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="bg-background-page flex flex-col justify-center rounded-lg p-6 text-center shadow-md">
      {/* Icon Placeholder */}
      <div className="text-accent mx-auto mb-4 text-4xl">
        <Icon aria-hidden="true" />
      </div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}
