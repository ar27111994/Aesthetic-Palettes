// app/components/HomePage/TestimonialCard.tsx
import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
}

export function TestimonialCard({ quote, name, role }: TestimonialCardProps) {
  return (
    <div className="bg-background-page flex flex-col rounded-lg p-6 shadow-md">
      <FaQuoteLeft
        className="text-primary-action mb-4 text-4xl"
        aria-hidden="true"
      />
      <blockquote className="mb-4 flex-grow italic">{quote}</blockquote>
      <footer className="text-right">
        <p className="text-text-heading font-semibold">{name}</p>
        <p className="text-text-secondary text-sm">{role}</p>
      </footer>
    </div>
  );
}
