// app/components/HomePage/TestimonialsSection.tsx
import React from "react";
import { TestimonialCard } from "./TestimonialCard";
import { createTranslator } from "next-intl";

interface TestimonialsSectionProps {
  tTestimonials: ReturnType<typeof createTranslator>;
}

const testimonialsData = [
  {
    id: "1",
    quoteKey: "quote1",
    nameKey: "name1",
    roleKey: "role1",
  },
  {
    id: "2",
    quoteKey: "quote2",
    nameKey: "name2",
    roleKey: "role2",
  },
  {
    id: "3",
    quoteKey: "quote3",
    nameKey: "name3",
    roleKey: "role3",
  },
];

export function TestimonialsSection({
  tTestimonials,
}: TestimonialsSectionProps) {
  return (
    <section
      id="testimonials"
      className="bg-background-subtle w-full py-8 shadow-inner md:py-12"
    >
      <h2 className="mb-12 text-center">{tTestimonials("title")}</h2>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
        {testimonialsData.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            quote={tTestimonials(testimonial.quoteKey)}
            name={tTestimonials(testimonial.nameKey)}
            role={tTestimonials(testimonial.roleKey)}
          />
        ))}
      </div>
    </section>
  );
}
