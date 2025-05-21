// app/components/HomePage/AccessibilitySection.tsx
import React from "react";
import Link from "next/link";
import { Button } from "@components/Button";
import { FiEye, FiCheckSquare } from "react-icons/fi";
import { createTranslator } from "next-intl";

interface AccessibilitySectionProps {
  tAccessibility: ReturnType<typeof createTranslator>;
}

export function AccessibilitySection({
  tAccessibility,
}: AccessibilitySectionProps) {
  return (
    <section
      id="accessibility"
      className="bg-primary-action/10 mb-8 w-full py-8 shadow-inner md:mb-12 md:py-12"
    >
      <h2 className="mb-12 text-center">{tAccessibility("title")}</h2>
      <div className="flex flex-col items-center justify-center gap-8 px-6 md:flex-row">
        {/* Icons Placeholder */}
        <div className="text-primary-action flex gap-4 text-5xl">
          <FiEye aria-hidden="true" /> {/* Simulator Icon */}
          <FiCheckSquare aria-hidden="true" /> {/* Checker Icon */}
        </div>
        <p className="max-w-2xl text-center text-lg md:text-left">
          {tAccessibility("description")}
        </p>
      </div>
      <div className="mt-8 text-center">
        <Link href="/docs/accessibility" passHref>
          <Button
            variant="link" // Changed from 'flat' to 'link'
            color="primary"
          >
            {tAccessibility("learnMoreButton")}
          </Button>
        </Link>
      </div>
    </section>
  );
}
