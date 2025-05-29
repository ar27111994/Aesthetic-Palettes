"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link"; // Assuming Next.js for routing
import { Button } from "@components/Button"; // Assuming a Button component exists
import { useTranslations } from "next-intl"; // Import useTranslations
import { ToggleSwitch } from "@components/ToggleSwitch"; // Assuming a ToggleSwitch component exists
import { Modal } from "@components/Modal"; // Import the shared Modal component

const COOKIE_CONSENT_KEY = "aesthetic_palettes_cookie_consent";

// TODO: Define specific types for cookie preferences if they become more granular
// interface CookiePreferences {
//   analytics: boolean;
//   marketing: boolean;
//   // etc.
// }

type ConsentStatus = "accepted" | "rejected" | "pending";

const CookieConsentBanner: React.FC = () => {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("pending");
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const t = useTranslations("CookieConsent"); // Initialize translations

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    // SEO: Ensure this banner does not cause Cumulative Layout Shift (CLS).
    // The current approach of returning null when consent is not pending is good.
    // Performance: useEffect runs once on mount, which is efficient for reading localStorage.
    if (storedConsent === "accepted" || storedConsent === "rejected") {
      setConsentStatus(storedConsent);
    } else {
      setConsentStatus("pending"); // Show banner if no decision or invalid value
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setConsentStatus("accepted");
    // Add logic here to enable analytics/marketing cookies if needed
    // Consider using react-hot-toast for a non-intrusive confirmation message.
    // e.g., toast.success(t("preferencesSaved"));
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    setConsentStatus("rejected");
    // Add logic here to disable non-essential cookies
    // Consider using react-hot-toast for a non-intrusive confirmation message.
  };

  const handleSavePreferences = (preferences: any) => {
    // Logic to save specific preferences (e.g., analytics only)
    // TODO: Implement actual cookie management
    console.log("Saving cookie preferences:", preferences);
    // For now, let's treat saving preferences as accepting essential + chosen
    // This needs more detailed implementation based on actual categories
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted"); // Simplified for now
    setConsentStatus("accepted");
    setIsPreferencesModalOpen(false);
    // Consider using react-hot-toast for a non-intrusive confirmation message.
    // e.g., toast.success(t("preferencesSaved"));
  };

  const openPreferencesModal = () => setIsPreferencesModalOpen(true);
  const closePreferencesModal = () => setIsPreferencesModalOpen(false);

  // Accessibility: Consider managing focus when the banner appears.
  // For example, programmatically focusing the banner itself or the first interactive element.
  // However, this might be disruptive, so test thoroughly.
  if (consentStatus !== "pending") {
    return null; // Don't show banner if already accepted or rejected
  }

  // Next.js PPR: This component is client-side due to localStorage and state.
  // It will hydrate and run on the client after the server-rendered shell is delivered.
  // This is compatible with PPR as it doesn't block initial page render.

  return (
    <>
      {/* Banner */}
      {/* Banner */}
      {/* Mobile-First Responsive Design: Uses flex-col and md:flex-row for layout changes. Padding and spacing are responsive. */}
      {/* WCAG Contrast: Verify contrast for text on 'bg-background-dark-1'. Ensure all text, including link, meets AA/AAA. */}
      <div
        className="bg-background-dark-1 fixed right-0 bottom-0 left-0 z-50 flex flex-col items-center justify-between space-y-3 p-4 shadow-lg md:flex-row md:space-y-0 md:space-x-4"
        role="region" // Accessibility: Good use of role="region" for landmark.
        aria-label={t("bannerAriaLabel")} // Accessibility: Provides an accessible name for the region.
      >
        <p className="text-background-page text-center text-sm md:text-left">
          {t("bannerMessage")}
          {/* TODO: Replace with actual link to Cookie Policy page */}
          {/* SEO: Link to a comprehensive cookie policy page is good practice. */}
          <Link
            href="/cookie-policy" // TODO: Ensure this path is correct and the page exists.
            className="focus:ring-background-page hover:text-text-secondary-hover focus:ring-offset-ring-offset-dark ml-1 rounded underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            {t("learnMoreLink")} {/* Use translation key */}
          </Link>
          .
        </p>
        <div className="flex flex-shrink-0 space-x-3">
          <Button onClick={handleAcceptAll} variant="primary" size="sm">
            {t("acceptAllButton")} {/* Use translation key */}
          </Button>
          <Button onClick={openPreferencesModal} variant="secondary" size="sm">
            {t("customizeButton")} {/* Use translation key */}
          </Button>
          {/* Optional Reject Button */}
          <Button
            onClick={handleRejectNonEssential}
            variant="tertiary"
            size="sm"
          >
            {t("rejectButton")}
          </Button>
        </div>
      </div>

      {/* Preferences Modal using shared Modal component */}
      {/* Accessibility: Handled by Modal.tsx (focus trapping, aria attributes, Escape key). */}
      {/* WCAG Contrast: Verify contrast for children and footer content against modal background. */}
      <Modal
        isOpen={isPreferencesModalOpen}
        onClose={closePreferencesModal}
        title={t("modalTitle")} // Use translation key
        size="md" // Matches previous max-w-md
        // className specific to this modal instance if needed, Modal has good defaults
        footer={
          <div className="flex justify-end space-x-3">
            <Button onClick={handleSavePreferences} variant="primary">
              {t("savePreferencesButton")} {/* Use translation key */}
            </Button>
            <Button onClick={handleAcceptAll} variant="secondary">
              {t("acceptAllButton")} {/* Use translation key */}
            </Button>
            <Button onClick={closePreferencesModal} variant="tertiary">
              {t("cancelButton")} {/* Use translation key */}
            </Button>
          </div>
        }
      >
        {/* Content for the modal body */}
        {/* Mobile-First Responsive Design: Modal component handles responsiveness. Content should adapt. */}
        <div className="mt-2 space-y-4">
          <p className="text-text-secondary text-sm">
            {t("modalDescription")} {/* Use translation key */}
          </p>

          {/* Cookie Categories - TODO: Implement actual toggles and state */}
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded border p-3">
              <label
                htmlFor="essential-cookies"
                className="cursor-not-allowed font-medium opacity-50"
              >
                {t("essentialCookiesLabel")}
                {/* Use translation key */}
              </label>
              <ToggleSwitch
                enabled={true}
                disabled // Accessibility: Clearly indicates non-interactive state.
                label={t("essentialCookiesLabel")} // Used for internal logic or if hideLabel was false
                aria-label={t("essentialCookiesLabel")} // Accessibility: Provides accessible name when visual label is hidden.
                id="essential-cookies"
                hideLabel // Accessibility: Ensure aria-label is sufficient if visual label is truly hidden.
              />
            </div>
            <div className="flex items-center justify-between rounded border p-3">
              <label htmlFor="analytics-cookies" className="font-medium">
                {t("analyticsCookiesLabel")}
                {/* Use translation key */}
              </label>
              {/* TODO: Implement state management for this toggle. onChange should update a state variable. */}
              <ToggleSwitch
                enabled={true} // TODO: This should be driven by state.
                onChange={(_enabled) => {
                  /* TODO: Update analytics preference state */
                }}
                label={t("analyticsCookiesLabel")}
                aria-label={t("analyticsCookiesLabel")}
                id="analytics-cookies"
                hideLabel
              />
            </div>
            <div className="flex items-center justify-between rounded border p-3">
              <label htmlFor="marketing-cookies" className="font-medium">
                {t("marketingCookiesLabel")}
                {/* Use translation key */}
              </label>
              {/* TODO: Implement state management for this toggle. onChange should update a state variable. */}
              <ToggleSwitch
                enabled={false} // TODO: This should be driven by state.
                onChange={(_enabled) => {
                  /* TODO: Update marketing preference state */
                }}
                label={t("marketingCookiesLabel")}
                aria-label={t("marketingCookiesLabel")}
                id="marketing-cookies"
                hideLabel
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CookieConsentBanner;
