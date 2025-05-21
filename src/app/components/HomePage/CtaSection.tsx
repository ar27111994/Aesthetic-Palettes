// app/components/HomePage/CtaSection.tsx
import React from "react";
import Link from "next/link";
import { Button } from "@components/Button";
import { createTranslator } from "next-intl";

interface CtaSectionProps {
  tCta: ReturnType<typeof createTranslator>;
}

export function CtaSection({ tCta }: CtaSectionProps) {
  return (
    <section
      id="signup"
      className="from-feedback-success to-primary-action text-background-page w-full bg-gradient-to-r py-8 shadow-inner text-shadow-md md:py-12"
    >
      <div className="px-6 text-center">
        <h2 className="mb-4">{tCta("title")}</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg font-medium">
          {tCta("description")}
        </p>
        <Link href="/signup" passHref>
          <Button
            variant="outline"
            size="lg"
            className="text-primary-action text-lg font-bold shadow-md"
          >
            {tCta("signUpButton")}
          </Button>
        </Link>
      </div>
    </section>
  );
}
