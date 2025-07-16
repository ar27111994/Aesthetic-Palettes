import React from "react";
import { expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { HowItWorksSection } from "./HowItWorksSection";

// Mock the next-intl translator function
// Updated with translations from `messages/en.json` for accuracy.
// This keeps the test isolated without dealing with potential module resolution issues
// for the JSON file, while ensuring the test uses up-to-date copy.
const tHowItWorks = Object.assign(
  function <TargetKey extends string>(key: TargetKey, ..._args: any[]): string {
    const translations: { [key: string]: string } = {
      title: "How It Works",
      step1Title: "Generate or Explore",
      step1Description:
        "Start with AI suggestions or browse community creations",
      step2Title: "Refine & Adjust",
      step2Description:
        "Use advanced tools to perfect your color relationships",
      step3Title: "Export & Share",
      step3Description: "Download assets or collaborate with team members",
    };
    return translations[key] || key;
  },
  {
    rich: <TargetKey extends string>(key: TargetKey, ..._args: any[]) =>
      tHowItWorks(key),
    markup: <TargetKey extends string>(key: TargetKey, ..._args: any[]) =>
      tHowItWorks(key),
    raw: <TargetKey extends string>(key: TargetKey, ..._args: any[]) =>
      tHowItWorks(key),
    has: <TargetKey extends string>(key: TargetKey) => true,
  },
);

describe("HowItWorksSection", () => {
  beforeEach(() => {
    render(<HowItWorksSection tHowItWorks={tHowItWorks} />);
  });

  it("renders the main title with the correct heading level", () => {
    // As per semantic structure, the section title should be an H2.
    expect(
      screen.getByRole("heading", { name: /how it works/i, level: 2 }),
    ).toBeInTheDocument();
  });

  it("renders the first step with its title and description", () => {
    // Step titles should be semantically nested, e.g., H3.
    expect(
      screen.getByRole("heading", { name: /generate or explore/i, level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Start with AI suggestions or browse community creations",
      ),
    ).toBeInTheDocument();
  });

  it("renders the second step with its title and description", () => {
    expect(
      screen.getByRole("heading", { name: /refine & adjust/i, level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Use advanced tools to perfect your color relationships",
      ),
    ).toBeInTheDocument();
  });

  it("renders the third step with its title and description", () => {
    expect(
      screen.getByRole("heading", { name: /export & share/i, level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Download assets or collaborate with team members"),
    ).toBeInTheDocument();
  });
});
