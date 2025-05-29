"use client";

import React, { memo } from "react"; // Import memo for performance optimization
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
import { Tooltip } from "@components/Tooltip"; // Import Tooltip for enhanced accessibility

/**
 * Footer component displaying navigation links, social media icons, and copyright information.
 *
 * @component
 * @example
 * return (
 *   <Footer />
 * )
 *
 * @remarks
 * This component is designed with the following best practices in mind:
 * - **Mobile-First Responsive Design**: Adapts layout for various screen sizes using Tailwind CSS utility classes.
 * - **SEO**: Uses semantic HTML elements (`footer`, `nav`, `h2`, `ul`, `li`, `a`) and descriptive link text (via `next-intl`) to improve search engine visibility.
 * - **Accessibility (WCAG)**:
 *   - `role="contentinfo"` for the footer landmark.
 *   - `<nav>` elements with `aria-labelledby` for navigation sections.
 *   - `aria-label` for icon-only links (social media).
 *   - Tooltips for social media icons to provide additional context on hover/focus.
 *   - Focus indicators are enhanced with explicit `focus-visible:ring` styles for better keyboard navigation feedback.
 *   - **WCAG Contrast**: Color choices rely on the existing theme (`bg-background-subtle`, `text-text-heading`, etc.). It's crucial to verify that these theme colors meet WCAG AA or AAA contrast ratios. Comments are added to prompt this verification.
 * - **Performance Optimization**: Uses `React.memo` to prevent unnecessary re-renders. `next/link` is used for efficient client-side navigation.
 * - **Next.js PPR (Partial Prerendering)**: As a client component (`"use client"`) due to `useTranslations`, it will be hydrated on the client. Ensure initial render is fast. Content is largely static post-translation.
 * - **Internationalization**: Uses `next-intl` for translated strings, enhancing global accessibility.
 */
const FooterComponent: React.FC = () => {
  // Renamed to FooterComponent for memo export
  const currentYear = new Date().getFullYear();
  const t = useTranslations("Footer"); // Initialize translations for Footer namespace

  return (
    <footer
      role="contentinfo"
      className="bg-background-subtle text-text-heading w-full px-4 pt-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-4">
        {/* Product Column - Navigation section for product-related links */}
        {/* Using <nav> with aria-labelledby for better accessibility and semantic HTML for SEO */}
        <nav aria-labelledby="product-links-heading">
          <h2
            id="product-links-heading"
            className="mb-4 tracking-tight capitalize"
          >
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
        </nav>

        {/* Community Column - Navigation section for community-related links */}
        {/* Using <nav> with aria-labelledby for better accessibility */}
        <nav aria-labelledby="community-links-heading">
          <h2
            id="community-links-heading"
            className="mb-4 tracking-tight capitalize"
          >
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
        </nav>

        {/* Resources Column - Navigation section for resource-related links */}
        {/* Using <nav> with aria-labelledby for better accessibility */}
        <nav aria-labelledby="resources-links-heading">
          <h2
            id="resources-links-heading"
            className="mb-4 tracking-tight capitalize"
          >
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
        </nav>

        {/* Legal Column - Navigation section for legal-related links */}
        {/* Using <nav> with aria-labelledby for better accessibility */}
        <nav aria-labelledby="legal-links-heading">
          <h2
            id="legal-links-heading"
            className="mb-4 tracking-tight capitalize"
          >
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
        </nav>
      </div>

      {/* Social Media & Copyright */}
      <div className="border-border-divider mt-10 flex w-full flex-col items-center justify-between overflow-x-hidden border-t-2 px-4 py-4 sm:px-6 md:flex-row lg:px-8">
        <p className="text-text-secondary w-full truncate text-sm font-medium md:text-lg">
          {t("copyright", { year: currentYear })}
          {/* Use translation key with variable */}
        </p>
        {/* Social Media Icons - Enhanced with Tooltips for better accessibility and user experience */}
        {/* Ensure these links have `rel="noopener noreferrer"` if they open in a new tab, though Next.js Link handles this well for external URLs. */}
        {/* WCAG Contrast: Verify icon colors against background meet AA/AAA. Hover/focus states should also maintain contrast. */}
        <div className="mt-4 flex space-x-4 text-2xl md:mt-0">
          <Tooltip content={t("twitter")}>
            <Link
              href="#"
              aria-label={t("twitter")}
              className="focus-visible:ring-primary-focus-ring rounded-sm focus-visible:ring-2"
            >
              <FiTwitter className="hover:text-primary-action-hover" />
            </Link>
          </Tooltip>
          <Tooltip content={t("facebook")}>
            <Link
              href="#"
              aria-label={t("facebook")}
              className="focus-visible:ring-primary-focus-ring rounded-sm focus-visible:ring-2"
            >
              <FiFacebook className="hover:text-primary-action-hover" />
            </Link>
          </Tooltip>
          <Tooltip content={t("instagram")}>
            <Link
              href="#"
              aria-label={t("instagram")}
              className="focus-visible:ring-primary-focus-ring rounded-sm focus-visible:ring-2"
            >
              <FiInstagram className="hover:text-primary-action-hover" />
            </Link>
          </Tooltip>
          <Tooltip content={t("youtube")}>
            <Link
              href="#"
              aria-label={t("youtube")}
              className="focus-visible:ring-primary-focus-ring rounded-sm focus-visible:ring-2"
            >
              <FiYoutube className="hover:text-primary-action-hover" />
            </Link>
          </Tooltip>
          <Tooltip content={t("github")}>
            <Link
              href="#"
              aria-label={t("github")}
              className="focus-visible:ring-primary-focus-ring rounded-sm focus-visible:ring-2"
            >
              <FiGithub className="hover:text-primary-action-hover" />
            </Link>
          </Tooltip>
          <Tooltip content={t("dribble")}>
            <Link
              href="#"
              aria-label={t("dribble")}
              className="focus-visible:ring-primary-focus-ring rounded-sm focus-visible:ring-2"
            >
              <FiDribbble className="hover:text-primary-action-hover" />
            </Link>
          </Tooltip>
          <Tooltip content={t("email")}>
            <Link
              href="#"
              aria-label={t("email")}
              className="focus-visible:ring-primary-focus-ring rounded-sm focus-visible:ring-2"
            >
              <FiMail className="hover:text-primary-action-hover" />
            </Link>
          </Tooltip>
        </div>
        {/* Performance: FooterComponent is wrapped with React.memo to prevent unnecessary re-renders. */}
        {/* Next.js PPR: This component uses "use client" for translations. Ensure that any data fetching or heavy computation is minimized for fast initial load. */}
        {/* Mobile-First: Layout adjusts using Tailwind's responsive prefixes (e.g., md:grid-cols-4, md:flex-row). Test thoroughly on various devices. */}
        {/* WCAG Contrast: Ensure text and icon colors meet AA/AAA contrast against the background. Check hover/focus states too. */}
      </div>
    </footer>
  );
};

const Footer = memo(FooterComponent);
export default Footer;
