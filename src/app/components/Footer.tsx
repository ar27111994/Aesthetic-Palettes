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

interface NavLinkItem {
  href: string;
  translationKey: string;
}

interface NavSectionProps {
  titleKey: string;
  links: NavLinkItem[];
  t: (key: string) => string; // Add t function to props
}

const NavSection: React.FC<NavSectionProps> = ({ titleKey, links, t }) => (
  <nav aria-labelledby={`${titleKey}-heading`}>
    <h2 id={`${titleKey}-heading`} className="mb-4 tracking-tight capitalize">
      {t(titleKey)} {/* Use translation key */}
    </h2>
    <ul className="text-text-secondary space-y-2 text-lg font-medium">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="hover:text-primary-action-hover">
            {t(link.translationKey)} {/* Use translation key */}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

interface SocialLinkItem {
  href: string;
  translationKey: string;
  IconComponent: React.ElementType;
}

interface SocialLinksProps {
  links: SocialLinkItem[];
  t: (key: string) => string; // Add t function to props
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links, t }) => (
  <div className="mt-4 flex space-x-4 text-2xl md:mt-0">
    {links.map((link) => (
      <Tooltip content={t(link.translationKey)} key={link.href}>
        <Link
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t(link.translationKey)}
          className="focus-visible:ring-focus-indicator rounded-sm focus-visible:ring-2"
        >
          <link.IconComponent className="hover:text-primary-action-hover" />
        </Link>
      </Tooltip>
    ))}
  </div>
);

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

  const navSections: Omit<NavSectionProps, "t">[] = [
    {
      titleKey: "section.product",
      links: [
        { href: "/about", translationKey: "link.about" },
        { href: "/features", translationKey: "link.features" },
        { href: "/pricing", translationKey: "link.pricing" },
        { href: "/blog", translationKey: "link.blog" },
      ],
    },
    {
      titleKey: "section.community",
      links: [
        { href: "/forum", translationKey: "link.forum" },
        { href: "/report", translationKey: "link.reportContent" },
        { href: "/users", translationKey: "link.featuredUsers" },
      ],
    },
    {
      titleKey: "section.resources",
      links: [
        { href: "/help", translationKey: "link.help" },
        { href: "/tutorials", translationKey: "link.tutorial" },
        { href: "/api", translationKey: "link.apiDocs" },
        { href: "/accessibility", translationKey: "link.accessibility" },
        { href: "/docs", translationKey: "link.documentation" },
        { href: "/roadmap", translationKey: "link.roadmap" },
        { href: "/design-docs", translationKey: "link.designDocs" },
        { href: "/developer", translationKey: "link.developerPortal" },
        { href: "/status", translationKey: "link.statusPage" },
        { href: "/support", translationKey: "link.support" },
      ],
    },
    {
      titleKey: "section.legal",
      links: [
        { href: "/terms", translationKey: "link.terms" },
        { href: "/privacy", translationKey: "link.privacy" },
        { href: "/cookies", translationKey: "link.cookies" },
        {
          href: "/cookie-preferences",
          translationKey: "link.manageCookies",
        },
        { href: "/licensing", translationKey: "link.licensing" },
      ],
    },
  ];

  const socialLinks: Omit<SocialLinkItem, "t">[] = [
    { href: "#", translationKey: "twitter", IconComponent: FiTwitter },
    { href: "#", translationKey: "facebook", IconComponent: FiFacebook },
    { href: "#", translationKey: "instagram", IconComponent: FiInstagram },
    { href: "#", translationKey: "youtube", IconComponent: FiYoutube },
    { href: "#", translationKey: "github", IconComponent: FiGithub },
    { href: "#", translationKey: "dribbble", IconComponent: FiDribbble },
    { href: "#", translationKey: "email", IconComponent: FiMail },
  ];

  return (
    <footer
      role="contentinfo"
      className="bg-background-subtle text-text-heading w-full px-4 pt-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-4">
        {navSections.map((section) => (
          <NavSection key={section.titleKey} {...section} t={t} />
        ))}
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
        <SocialLinks links={socialLinks} t={t} />
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
