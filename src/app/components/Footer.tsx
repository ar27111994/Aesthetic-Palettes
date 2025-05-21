"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl"; // Import useTranslations
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMail,
  FiDribbble,
  FiGithub,
} from "react-icons/fi";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("Footer"); // Initialize translations for Footer namespace

  return (
    <footer
      role="contentinfo"
      className="bg-background-subtle text-text-heading w-full px-4 pt-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-4">
        {/* Product Column */}
        <div>
          <h2 className="mb-4 tracking-tight capitalize">
            {t("section.product")} {/* Use translation key */}
          </h2>
          <ul className="text-text-secondary space-y-2 text-lg font-medium">
            <li>
              <Link href="/about" className="hover:text-primary-action-hover">
                {t("link.about")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link
                href="/features"
                className="hover:text-primary-action-hover"
              >
                {t("link.features")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-primary-action-hover">
                {t("link.pricing")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-primary-action-hover">
                {t("link.blog")} {/* Use translation key */}
              </Link>
            </li>
          </ul>
        </div>

        {/* Community Column */}
        <div>
          <h2 className="mb-4 tracking-tight capitalize">
            {t("section.community")} {/* Use translation key */}
          </h2>
          <ul className="text-text-secondary space-y-2 text-lg font-medium">
            <li>
              <Link href="/forum" className="hover:text-primary-action-hover">
                {t("link.forum")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link href="/report" className="hover:text-primary-action-hover">
                {t("link.reportContent")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link href="/users" className="hover:text-primary-action-hover">
                {t("link.featuredUsers")} {/* Use translation key */}
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h2 className="mb-4 tracking-tight capitalize">
            {t("section.resources")} {/* Use translation key */}
          </h2>
          <ul className="text-text-secondary space-y-2 text-lg font-medium">
            <li>
              <Link href="/help" className="hover:text-primary-action-hover">
                {t("link.help")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link
                href="/tutorials"
                className="hover:text-primary-action-hover"
              >
                {t("link.tutorial")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link href="/api" className="hover:text-primary-action-hover">
                {t("link.apiDocs")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link
                href="/accessibility"
                className="hover:text-primary-action-hover"
              >
                {t("link.accessibility")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link href="/docs" className="hover:text-primary-action-hover">
                {t("link.documentation")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link href="/roadmap" className="hover:text-primary-action-hover">
                {t("link.roadmap")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link
                href="/design-docs"
                className="hover:text-primary-action-hover"
              >
                {t("link.designDocs")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link
                href="/developer"
                className="hover:text-primary-action-hover"
              >
                {t("link.developerPortal")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link href="/status" className="hover:text-primary-action-hover">
                {t("link.statusPage")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-primary-action-hover">
                {t("link.support")} {/* Use translation key */}
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h2 className="mb-4 tracking-tight capitalize">
            {t("section.legal")} {/* Use translation key */}
          </h2>
          <ul className="text-text-secondary space-y-2 text-lg font-medium">
            <li>
              <Link href="/terms" className="hover:text-primary-action-hover">
                {t("link.terms")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-primary-action-hover">
                {t("link.privacy")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-primary-action-hover">
                {t("link.cookies")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              {/* TODO: Link this to the cookie preferences modal/manager */}
              <Link
                href="/cookie-preferences" // Placeholder link
                className="hover:text-primary-action-hover"
              >
                {t("link.manageCookies")} {/* Use translation key */}
              </Link>
            </li>
            <li>
              <Link
                href="/licensing"
                className="hover:text-primary-action-hover"
              >
                {t("link.licensing")} {/* Use translation key */}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media & Copyright */}
      <div className="border-border-divider mt-10 flex w-full flex-col items-center justify-between overflow-x-hidden border-t-2 px-4 py-4 sm:px-6 md:flex-row lg:px-8">
        <p className="text-text-secondary w-full truncate text-sm font-medium md:text-lg">
          {t("copyright", { year: currentYear })}
          {/* Use translation key with variable */}
        </p>
        {/* Social Media Icons */}
        <div className="mt-4 flex space-x-4 text-2xl md:mt-0">
          <Link href="#" aria-label={t("twitter")}>
            <FiTwitter className="hover:text-primary-action-hover"></FiTwitter>
          </Link>
          <Link href="#" aria-label={t("facebook")}>
            <FiFacebook className="hover:text-primary-action-hover"></FiFacebook>
          </Link>
          <Link href="#" aria-label={t("instagram")}>
            <FiInstagram className="hover:text-primary-action-hover"></FiInstagram>
          </Link>
          <Link href="#" aria-label={t("youtube")}>
            <FiYoutube className="hover:text-primary-action-hover"></FiYoutube>
          </Link>
          <Link href="#" aria-label={t("github")}>
            <FiGithub className="hover:text-primary-action-hover"></FiGithub>
          </Link>
          <Link href="#" aria-label={t("dribble")}>
            <FiDribbble className="hover:text-primary-action-hover"></FiDribbble>
          </Link>
          <Link href="#" aria-label={t("email")}>
            <FiMail className="hover:text-primary-action-hover"></FiMail>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
