"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link"; // Assuming Next.js for routing
import { Button } from "@components/Button"; // Assuming a Button component exists
import { useTranslations } from "next-intl"; // Import useTranslations
import { ToggleSwitch } from "@components/ToggleSwitch"; // Assuming a ToggleSwitch component exists

const COOKIE_CONSENT_KEY = "aesthetic_palettes_cookie_consent";

type ConsentStatus = "accepted" | "rejected" | "pending";

const CookieConsentBanner: React.FC = () => {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("pending");
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const t = useTranslations("CookieConsent"); // Initialize translations

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
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
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    setConsentStatus("rejected");
    // Add logic here to disable non-essential cookies
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
  };

  const openPreferencesModal = () => setIsPreferencesModalOpen(true);
  const closePreferencesModal = () => setIsPreferencesModalOpen(false);

  if (consentStatus !== "pending") {
    return null; // Don't show banner if already accepted or rejected
  }

  return (
    <>
      {/* Banner */}
      <div
        className="bg-background-dark-1 fixed right-0 bottom-0 left-0 z-50 flex flex-col items-center justify-between space-y-3 p-4 shadow-lg md:flex-row md:space-y-0 md:space-x-4"
        role="region"
        aria-label={t("bannerAriaLabel")} // Use translation key
      >
        <p className="text-background-page text-center text-sm md:text-left">
          {t("bannerMessage")}
          {/* TODO: Replace with actual link to Cookie Policy page */}
          <Link
            href="/cookie-policy"
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

      {/* Preferences Modal */}
      <Transition appear show={isPreferencesModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[60]"
          onClose={closePreferencesModal}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="bg-background-page w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all motion-reduce:transition-none">
                  <DialogTitle
                    as="h3"
                    className="text-text-heading mb-4 text-lg leading-6 font-medium"
                  >
                    {t("modalTitle")} {/* Use translation key */}
                  </DialogTitle>
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
                          disabled
                          label={t("essentialCookiesLabel")}
                          aria-label={t("essentialCookiesLabel")}
                          id="essential-cookies"
                          hideLabel
                        />
                      </div>
                      <div className="flex items-center justify-between rounded border p-3">
                        <label
                          htmlFor="analytics-cookies"
                          className="font-medium"
                        >
                          {t("analyticsCookiesLabel")}
                          {/* Use translation key */}
                        </label>
                        <ToggleSwitch
                          enabled={true}
                          onChange={(_enabled) => {}}
                          label={t("analyticsCookiesLabel")}
                          aria-label={t("analyticsCookiesLabel")}
                          id="analytics-cookies"
                          hideLabel
                        />
                      </div>
                      <div className="flex items-center justify-between rounded border p-3">
                        <label
                          htmlFor="marketing-cookies"
                          className="font-medium"
                        >
                          {t("marketingCookiesLabel")}
                          {/* Use translation key */}
                        </label>
                        <ToggleSwitch
                          enabled={false}
                          onChange={(_enabled) => {}}
                          label={t("marketingCookiesLabel")}
                          aria-label={t("marketingCookiesLabel")}
                          id="marketing-cookies"
                          hideLabel
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
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
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CookieConsentBanner;
