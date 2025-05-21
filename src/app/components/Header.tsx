"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiGlobe,
  FiMoon,
  FiSun,
  FiMenu,
  FiX,
  FiUser,
  FiDroplet,
  FiCompass,
  FiUsers,
  FiBookOpen,
  FiPieChart,
  FiCode,
} from "react-icons/fi";
import { Button } from "@components/Button"; // Assuming Button component exists
import { Avatar } from "@components/Avatar"; // Assuming Avatar component exists
import Menu from "@components/Menu"; // Use the new Menu component
import { MenuItem } from "@typings/Menu";
import { Accordion } from "@components/Accordion"; // Import Accordion
import { Locale, useTranslations } from "next-intl";
import { useLocalesContext } from "@context/useLocalesContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@utils/cn";
import { InputField } from "@components/InputField"; // Import InputField
import Logo from "@components/Logo";

// TODO: Replace with actual authentication status logic
const useAuth = () => ({
  isAuthenticated: false,
  user: null,
  logout: () => {},
});

// TODO: Replace with actual theme toggle logic
const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  return { isDarkMode, toggleTheme };
};

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, availableLanguages } = useLocalesContext() as {
    language: Locale;
    availableLanguages: MenuItem[];
  };
  const t = useTranslations("Header");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const navLinks = [
    { href: "/generator", label: t("nav.generator"), icon: FiDroplet },
    { href: "/explore", label: t("nav.explore"), icon: FiCompass },
    { href: "/community", label: t("nav.community"), icon: FiUsers },
    { href: "/guides", label: t("nav.guides"), icon: FiBookOpen },
    { href: "/analytics", label: t("nav.analytics"), icon: FiPieChart },
    { href: "/api", label: t("nav.api"), icon: FiCode },
  ];

  const userMenuItems = [
    { href: "/dashboard", label: t("auth.dashboard") },
    { href: "/profile", label: t("auth.profile") },
    { href: "/settings", label: t("auth.settings") },
    { href: "/developer", label: t("auth.developer") },
  ];

  // Close mobile menu when user navigates to a new page
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname, searchParams, isMobileMenuOpen]);

  // Focus the search input when it is expanded
  useEffect(() => {
    if (isSearchExpanded && searchRef.current) {
      const timerId = setTimeout(() => {
        searchRef.current?.focus();
      }, 100); // Delay to allow CSS transition to make the input visible
      return () => clearTimeout(timerId);
    }
  }, [isSearchExpanded]);

  // Focus the mobile search input when menu is opened
  useEffect(() => {
    if (isMobileMenuOpen && mobileSearchRef.current) {
      const timerId = setTimeout(() => {
        mobileSearchRef.current?.focus();
      }, 100); // Delay to allow CSS transition to make the input visible
      return () => clearTimeout(timerId);
    }
  }, [isMobileMenuOpen]);

  const toggleSearchBar = () =>
    setIsSearchExpanded((prevIsSearchExpanded) => !prevIsSearchExpanded);

  const renderNavLinks = (isMobile = false) => (
    <nav
      aria-label={t("nav.primaryNavLabel")}
      className={cn({
        "flex flex-col": isMobile,
        "flex items-center space-x-6": !isMobile,
      })}
    >
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={pathname === link.href}
          className={cn(
            "flex text-base font-medium transition-colors motion-reduce:transition-none",
            {
              "p-2": isMobile,
              "p-1": pathname === link.href && !isMobile,
              "text-primary-action-hover hover:bg-background-subtle font-semibold":
                pathname === link.href,
              "text-text-heading hover:text-primary-action-hover":
                pathname !== link.href,
              "bg-primary-action-hover-alpha-10 hover:bg-primary-action-hover-alpha-20":
                pathname === link.href && isMobile,
              "hover:bg-primary-action-hover-alpha-10":
                pathname !== link.href && isMobile,
            },
          )}
        >
          {isMobile && link.icon && (
            <link.icon className="mr-2 h-5 w-5 shrink-0" />
          )}
          {link.label}
        </Link>
      ))}
    </nav>
  );

  const renderUserActions = (isMobile = false) => (
    <div
      className={cn("flex", {
        "border-border-divider flex-row justify-between border-t pt-4":
          isMobile,
        "items-center justify-center space-x-4": !isMobile,
      })}
    >
      {isAuthenticated && user ? (
        <Menu
          trigger={
            <Avatar
              src={(user as any).avatarUrl}
              alt={(user as any).username}
              size="sm"
              fallback={<FiUser aria-hidden="true" />}
            />
          }
          items={[
            ...userMenuItems,
            { isSeparator: true }, // Add separator before logout
            {
              label: t("auth.logout"), // Use translation key
              onClick: logout,
              isButton: true, // Style as button if needed by Menu component
            },
          ]}
          ariaLabel={t("userMenu")} // Add aria-label translation
        />
      ) : (
        <>
          <Button
            variant={isMobile ? "tertiary" : "secondary"}
            size="sm"
            onClick={() => router.push("/login")}
          >
            {t("auth.login")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push("/signup")}
          >
            {t("auth.signup")}
          </Button>
        </>
      )}
    </div>
  );

  const mobileLocaleSwitcher = {
    id: "language-switcher-mobile",
    title: (
      <div className="flex w-full items-center justify-between">
        <span className="flex items-center">
          <FiGlobe className="mr-2 h-5 w-5" aria-hidden="true" />
          {t("languageSelection")}: {language.toUpperCase()}
        </span>
      </div>
    ),
    content: (
      <div className="flex flex-col space-y-2 pt-2">
        {availableLanguages.map((lang) => (
          <Button
            key={lang.value}
            variant={language === lang.value ? "tertiary" : "secondary"}
            size="sm"
            onClick={lang.onClick}
            className="w-full justify-start text-left"
            aria-label={t("switchLanguage", {
              language: lang.label || "",
            })}
          >
            {lang.label}
          </Button>
        ))}
      </div>
    ),
  };

  const mobileThemeSwitcher = {
    id: "theme-switcher-mobile",
    title: (
      <div className="flex w-full items-center justify-between">
        <span className="flex items-center">
          {isDarkMode ? (
            <FiSun className="mr-2 h-5 w-5" aria-hidden="true" />
          ) : (
            <FiMoon className="mr-2 h-5 w-5" aria-hidden="true" />
          )}
          {t("themeOptions")}
        </span>
      </div>
    ),
    content: (
      <div className="pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          aria-pressed={isDarkMode}
          aria-label={t(isDarkMode ? "switchToLightMode" : "switchToDarkMode")}
          className="flex w-full items-center justify-start text-left"
        >
          {isDarkMode ? (
            <FiSun className="mr-2 h-5 w-5" aria-hidden="true" />
          ) : (
            <FiMoon className="mr-2 h-5 w-5" aria-hidden="true" />
          )}
          {t(isDarkMode ? "switchToLightMode" : "switchToDarkMode")}
        </Button>
      </div>
    ),
  };

  return (
    <header className="border-border-divider bg-background-page sticky top-0 z-50 w-full border-b">
      {/* Skip Navigation Link - Appx C.2 */}
      <a
        href="#main-content"
        className="focus:bg-background-page focus:text-text-body focus:ring-offset-focus-indicator sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:ring-2 focus:ring-offset-2"
      >
        {t("skipToMainContent")} {/* Use translation key */}
      </a>
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 md:px-6">
        {/* Left: Logo */}
        <Link
          passHref
          referrerPolicy="no-referrer"
          href="/"
          target="_blank"
          className="text-accent hover:text-primary-action-hover flex items-center justify-center space-x-2"
        >
          <Logo
            aria-label={t("logoAlt")} // Use translation key
            className="h-15 w-auto object-cover"
          />
          <h3 className="truncate font-extrabold">{t("siteName")}</h3>
          {/* Use translation key */}
        </Link>

        {/* Center: Desktop Navigation */}
        <div
          className={cn(
            "will-change-opacity will-change-max-width will-change-max-height will-change-pointer-events flex flex-1 justify-center opacity-0 transition-[max-width,max-height,opacity,transform,pointer-events] duration-500 ease-out will-change-transform motion-reduce:transition-none max-xl:hidden",
            {
              "pointer-events-none max-h-0 max-w-0 -translate-x-[40px] opacity-0":
                isSearchExpanded,
              "translate-x-0 xl:opacity-100": !isSearchExpanded,
            },
          )}
        >
          {renderNavLinks()}
        </div>

        {/* Right: Actions */}
        <div
          className={cn("flex items-center justify-end space-x-4", {
            "flex-1": isSearchExpanded,
          })}
        >
          <div className="hidden flex-1 items-center justify-end space-x-4 lg:flex">
            {/* Search */}
            <div className="flex flex-1 items-center justify-end">
              <Button
                className={cn("hover:text-primary-action-hover", {
                  "text-primary-action border-primary-action hover:border-primary-action-hover border-2":
                    isSearchExpanded,
                })}
                variant="ghost"
                size="icon"
                aria-label={t("toggleSearchBar")} // Use translation key
                onClick={toggleSearchBar}
                aria-expanded={isSearchExpanded}
              >
                <FiSearch className="h-5 w-5 text-inherit" aria-hidden="true" />
              </Button>
              <InputField
                ref={searchRef}
                label={t("searchLabel")} // Use translation key
                hideLabel={true}
                type="search"
                placeholder={t("searchPlaceholder")} // Use translation key
                aria-label={t("searchLabel")} // Add translation key for search input aria-label
                panelClassName={cn({
                  "w-0": !isSearchExpanded,
                  "-order-1": isSearchExpanded,
                })}
                className={cn(
                  // Base positioning and constant styles:
                  "absolute right-4 w-0 -translate-y-1/2", // Positions to the left and above the button's baseline for vertical centering.
                  "transform", // Ensures transforms can be applied.
                  "focus:ring-2 focus:outline-none", // focus styles.
                  "overflow-hidden", // Crucial for smooth max-width transition, prevents content spill.
                  // Core transition properties:
                  "transition-[max-width,width,opacity,transform,pointer-events,padding,margin] duration-300 ease-out motion-reduce:transition-none", // Animate all changes over 300ms with ease-out.
                  "will-change-opacity will-change-max-width will-change-width will-change-padding will-change-margin will-change-transform", // Performance hint for browsers.
                  // Conditional classes for animation states:
                  {
                    "pointer-events-auto w-[calc(100%-(--spacing(4)))] translate-x-2 opacity-100":
                      isSearchExpanded, // EXPANDED state
                    "pointer-events-none m-0 w-0 max-w-0 translate-x-0 border-none p-0 opacity-0":
                      !isSearchExpanded, // COLLAPSED state
                  },
                )}
              />
            </div>

            {/* Language Switcher */}
            <Menu
              trigger={
                <Button
                  className="hover:text-primary-action-hover aria-expanded:text-primary-action aria-expanded:border-primary-action hover:border-primary-action-hover aria-expanded:border-2"
                  variant="ghost"
                  size="icon"
                  aria-label={t("switchLanguage", { language: language })} // Use translation key with dynamic value
                >
                  <FiGlobe
                    className="h-5 w-5 text-inherit"
                    aria-hidden="true"
                  />
                </Button>
              }
              currentValue={language}
              items={availableLanguages}
              ariaLabel={t("languageSelection")} // Use translation key
            />

            {/* Theme Toggle */}
            <Button
              className="hover:text-primary-action-hover"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-pressed={isDarkMode}
              aria-label={t(
                isDarkMode ? "switchToLightMode" : "switchToDarkMode",
              )} // Use conditional translation keys
            >
              {isDarkMode ? (
                <FiSun className="h-5 w-5 text-inherit" aria-hidden="true" />
              ) : (
                <FiMoon className="h-5 w-5 text-inherit" aria-hidden="true" />
              )}
            </Button>

            {/* Desktop User Actions */}
            <div>{renderUserActions()}</div>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden">
            <Button
              variant="ghost"
              size="icon"
              className={cn({
                "text-primary-action border-primary-action hover:text-feedback-error hover:border-feedback-error border-2":
                  isMobileMenuOpen,
                "hover:text-primary-action-hover": !isMobileMenuOpen,
              })}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-controls="mobile-menu-drawer" // Link button to the drawer
              aria-expanded={isMobileMenuOpen}
              aria-label={t("toggleMobileMenu")} // Use translation key
            >
              {isMobileMenuOpen ? (
                <FiX className="h-5 w-5" aria-hidden="true" />
              ) : (
                <FiMenu className="h-9 w-9 text-inherit" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Backdrop for Mobile Menu */}
      {/* This is always in the DOM, visibility controlled by opacity and pointer-events */}
      <div
        onClick={() => setIsMobileMenuOpen(false)} // Close menu on backdrop click
        aria-hidden="true" // Backdrop is presentational
        className={cn(
          "bg-overlay-dark-alpha-50 fixed inset-0 top-16", // Covers viewport, semi-transparent black
          "xl:hidden", // Only show on smaller screens, matching the drawer
          "transition-opacity duration-300 ease-in-out", // Opacity transition
          "will-change-opacity", // Performance hint
          {
            "pointer-events-auto z-30 opacity-100": isMobileMenuOpen, // VISIBLE: z-30 (below drawer z-40, above content)
            "pointer-events-none -z-10 opacity-0": !isMobileMenuOpen, // HIDDEN: effectively remove from stacking and interaction
          },
        )}
      />

      {/* Mobile Menu Overlay/Drawer */}
      <div
        key={pathname} // Add key prop for React to re-render on pathname change
        tabIndex={-1} // Allows focus to be trapped within the drawer
        id="mobile-menu-drawer" // Added ID for aria-controls
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        aria-hidden={!isMobileMenuOpen} // Explicitly hide when not open
        className={cn(
          // Base styles (always present)
          "absolute inset-x-0 top-16", // Adjusted z-index to z-40 (safer for overlays)
          "bg-background-subtle border-border-divider border-t border-b shadow-md",
          "overflow-auto", // CRUCIAL for max-height transition
          "xl:hidden", // Responsive hiding for larger screens

          // Transition properties
          "transition-[max-height,opacity] duration-300 ease-in-out motion-reduce:transition-none", // Smooth transition
          "will-change-max-height will-change-opacity", // Performance hint

          // Conditional styles for expand/collapse
          {
            "pointer-events-auto z-40 max-h-[calc(100vh-(--spacing(16)))] opacity-100":
              isMobileMenuOpen, // EXPANDED - : z-40 (above backdrop z-30), --spacing(16) is 4rem (header height), so it fills viewport below header
            "pointer-events-none -z-10 max-h-0 opacity-0": !isMobileMenuOpen, // COLLAPSED
          },
        )}
      >
        <div
          className={cn(
            "container mx-auto space-y-4",
            // Transition properties
            "transition-[padding] duration-300 ease-in-out motion-reduce:transition-none", // Smooth transition
            "will-change-padding", // Performance hint

            {
              "p-4": isMobileMenuOpen,
              "m-0 p-0": !isMobileMenuOpen,
            },
          )}
        >
          <h2 id="mobile-menu-title" className="sr-only">
            {t("mobileMenuTitle")} {/* Use translation key */}
          </h2>
          {/* Mobile Search */}
          <div className="border-border-divider border-b pb-4 lg:hidden">
            <InputField
              ref={mobileSearchRef}
              label={t("searchLabel")} // Use translation key
              hideLabel={true}
              hint={<FiSearch aria-hidden="true" />}
              type="search"
              placeholder={t("searchPlaceholder")} // Use translation key
              aria-label={t("searchLabel")} // Use translation key
              className="focus:ring-2 focus:outline-none"
            />
          </div>
          {/* Workaround for mobile menu spacing being added for hidden elements as well */}
          <div className="lg:-mb-2">{renderNavLinks(true)}</div>
          {/* Language and Theme Switcher for Mobile using Accordion */}
          <div className="border-border-divider border-t pt-4 lg:hidden">
            <Accordion
              items={[mobileLocaleSwitcher, mobileThemeSwitcher]}
              itemClassName="w-full p-0"
              buttonClassName="w-full text-left justify-between rounded-md"
              panelClassName="pb-0 pt-0 px-0"
            />
          </div>
          <div className="lg:hidden">{renderUserActions(true)}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
