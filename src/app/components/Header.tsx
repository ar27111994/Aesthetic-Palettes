"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
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
  FiLogOut,
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
// import { useToast } from "@hooks/useToast"; // Example: if a toast system is available

// TODO: Replace with actual authentication status logic from context or store
const useAuth = () => {
  // This should ideally come from a global state (Context API, Redux, Zustand)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<null | {
    avatarUrl?: string;
    username: string;
  }>(null);
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    // Add actual logout logic here (e.g., API call, clear tokens)
    console.log("User logged out");
  }, []);
  // Simulate login for testing
  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsAuthenticated(true);
  //     setUser({ username: "TestUser", avatarUrl: "/path/to/avatar.png" });
  //   }, 2000);
  // }, []);
  return { isAuthenticated, user, logout };
};

// TODO: Replace with actual theme toggle logic from context or store
const useTheme = () => {
  // This should ideally come from a global state and persist preference
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
    // Add actual theme switching logic here (e.g., update body class, save to localStorage)
    console.log("Theme toggled");
  }, []);
  return { isDarkMode, toggleTheme };
};

/**
 * @file Header.tsx
 * @description Main application header component.
 *
 * @component Header
 * @returns {React.ReactElement} The rendered header component.
 *
 * @feature Mobile-First Responsive Design:
 * - Adapts layout and functionality for various screen sizes (mobile, tablet, desktop).
 * - Uses a collapsible mobile menu for navigation on smaller screens.
 * - Search bar expands/collapses appropriately.
 *
 * @feature SEO:
 * - Uses semantic HTML elements (`<header>`, `<nav>`, `<h1>`).
 * - Provides descriptive `aria-label` attributes for interactive elements.
 * - Includes a skip navigation link for accessibility and SEO.
 *
 * @feature Accessibility (WCAG AA & AAA Considerations):
 * - Keyboard Navigation: All interactive elements are focusable and operable via keyboard.
 * - Focus Management: Focus is trapped within the mobile menu when open; focus is returned to the trigger button when closed.
 * - ARIA Attributes: Uses `aria-expanded`, `aria-controls`, `aria-current`, `aria-label`, `aria-labelledby`, `aria-hidden`, `role="dialog"`, `aria-modal="true"`.
 * - Skip Navigation Link: Allows users to bypass the header and go directly to main content.
 * - Contrast: Leverages CSS classes that should adhere to WCAG contrast guidelines (responsibility of the theme/styling).
 * - Tooltips: Icon-only buttons should have tooltips for clarity (implementation depends on a `Tooltip` component).
 * - Toasts: (Placeholder for potential toast notifications, e.g., for search actions if applicable).
 *
 * @feature Performance Optimization:
 * - `React.memo` can be used to memoize the component if its props are unlikely to change frequently.
 * - `useCallback` is used for event handlers to prevent unnecessary re-renders of child components.
 * - `useEffect` dependencies are carefully managed.
 * - Conditional rendering and CSS transitions are used to manage visibility and layout changes efficiently.
 *
 * @feature Next.js PPR (Partial Prerendering):
 * - The component is client-rendered ("use client") due to its interactive nature (state, effects, event handlers).
 * - For PPR, dynamic data fetching (auth status, user info, theme, locale) should ideally be handled via Next.js data fetching methods or client-side fetching post-hydration if they don't need to be part of the initial static shell.
 * - Static parts of the header (logo, site name, basic structure) can benefit from PPR if dynamic parts are deferred.
 *
 * @dependency next/link: For client-side navigation.
 * @dependency next-intl: For internationalization.
 * @dependency react-icons/fi: For icons.
 * @dependency @components/*: Utilizes shared components like Button, Avatar, Menu, Accordion, InputField, Logo, Tooltip.
 * @dependency @context/useLocalesContext: For managing language context.
 * @dependency @utils/cn: For conditional class names.
 *
 * @todo
 * - Integrate actual authentication logic.
 * - Integrate actual theme persistence and application.
 * - Implement a shared `Tooltip` component and integrate it for all icon-only buttons.
 * - Consider replacing custom `Menu` with `@headlessui/react` `Menu` for enhanced accessibility and features if not already done.
 * - Review and ensure WCAG contrast ratios are met for all text and UI elements against their backgrounds across themes.
 */
const HeaderComponent: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuDrawerRef = useRef<HTMLDivElement>(null);

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
  // const { addToast } = useToast(); // Example for toasts

  const navLinks = useMemo(
    () => [
      { href: "/generator", label: t("nav.generator"), icon: FiDroplet },
      { href: "/explore", label: t("nav.explore"), icon: FiCompass },
      { href: "/community", label: t("nav.community"), icon: FiUsers },
      { href: "/guides", label: t("nav.guides"), icon: FiBookOpen },
      { href: "/analytics", label: t("nav.analytics"), icon: FiPieChart },
      { href: "/api", label: t("nav.api"), icon: FiCode },
    ],
    [t],
  );

  const userMenuItems = useMemo(
    () => [
      { href: "/dashboard", label: t("auth.dashboard") },
      { href: "/profile", label: t("auth.profile") },
      { href: "/settings", label: t("auth.settings") },
      { href: "/developer", label: t("auth.developer") },
    ],
    [t],
  );

  // Close mobile menu when user navigates to a new page
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]); // isMobileMenuOpen removed to prevent re-triggering on its own change

  // Focus the search input when it is expanded
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    if (isSearchExpanded && searchRef.current) {
      // Using requestAnimationFrame for smoother focus after layout changes
      timerId = setTimeout(() =>
        requestAnimationFrame(() => {
          searchRef.current?.focus();
        }),
      );
    }
    return () => timerId && clearTimeout(timerId); // Clear timeout if component unmounts or effect re-runs
  }, [isSearchExpanded]);

  // Focus the mobile search input when menu is opened
  useEffect(() => {
    if (isMobileMenuOpen && mobileSearchRef.current) {
      requestAnimationFrame(() => {
        mobileSearchRef.current?.focus();
      });
    }
  }, [isMobileMenuOpen]);

  // Trap focus within the mobile menu when it's open
  useEffect(() => {
    if (!isMobileMenuOpen || !mobileMenuDrawerRef.current) return;

    const focusableElements =
      mobileMenuDrawerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Focus the first focusable element in the drawer when it opens
    if (firstElement) firstElement.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const toggleSearchBar = useCallback(
    () => setIsSearchExpanded((prevIsSearchExpanded) => !prevIsSearchExpanded),
    [],
  );

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const renderNavLinks = useCallback(
    (isMobile = false) => (
      <nav
        aria-label={t(isMobile ? "nav.mobileNavLabel" : "nav.primaryNavLabel")} // Differentiate labels
        className={cn("flex", {
          "w-full flex-col space-y-1 p-2": isMobile, // Adjusted padding and spacing for mobile
          "flex items-center space-x-6": !isMobile,
        })}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname === link.href}
            className={cn(
              "flex rounded-md text-base font-medium transition-colors motion-reduce:transition-none", // Added rounded-md for better focus visibility on mobile
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
    ),
    [navLinks, pathname, t],
  );

  const renderUserActions = useCallback(
    (isMobile = false) => {
      const menuItemsForUser = [
        ...userMenuItems,
        { isSeparator: true },
        {
          label: t("auth.logout"),
          onClick: logout,
          isButton: true,
          icon: FiLogOut,
        },
      ];

      return (
        <div
          className={cn("flex", {
            // Added border-t for mobile user actions
            "border-border-divider flex-col space-y-2 border-t pt-4": isMobile,
            "items-center justify-center space-x-4": !isMobile,
          })}
        >
          {isAuthenticated && user ? (
            <Menu
              trigger={
                <Avatar
                  src={(user as any).avatarUrl}
                  alt={t("userAvatarAlt", { username: (user as any).username })}
                  size="sm"
                  fallback={<FiUser aria-hidden="true" />}
                />
              }
              items={menuItemsForUser}
              ariaLabel={t("userMenuLabel")}
            />
          ) : (
            <>
              <Button
                variant={isMobile ? "tertiary" : "secondary"} // Consistent variant for login
                size="sm"
                className={cn({ "w-full": isMobile })}
                onClick={() => router.push("/login")} // Consider using NextLink for prefetching if appropriate
                aria-label={t("auth.loginLabel")} // More descriptive aria-label
              >
                {t("auth.login")}
              </Button>
              <Button
                variant="primary"
                size="sm"
                className={cn({ "w-full": isMobile })}
                onClick={() => router.push("/signup")} // Consider using NextLink for prefetching
                aria-label={t("auth.signupLabel")} // More descriptive aria-label
              >
                {t("auth.signup")}
              </Button>
            </>
          )}
        </div>
      );
      // It's good practice to memoize if props don't change often, but ensure dependencies are correct.
    },
    [isAuthenticated, user, logout, router, t, userMenuItems],
  );

  const mobileLocaleSwitcher = useMemo(
    () => ({
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
    }),
    [t, language, availableLanguages],
  );

  const mobileThemeSwitcher = useMemo(
    () => ({
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
            aria-label={t(
              isDarkMode ? "switchToLightMode" : "switchToDarkMode",
            )}
            className="flex w-full items-center justify-start text-left"
          >
            {isDarkMode ? (
              <FiMoon className="mr-2 h-5 w-5" aria-hidden="true" />
            ) : (
              <FiSun className="mr-2 h-5 w-5" aria-hidden="true" />
            )}
            {t(isDarkMode ? "switchToLightMode" : "switchToDarkMode")}
          </Button>
        </div>
      ),
    }),
    [t, isDarkMode, toggleTheme],
  );

  return (
    <header className="border-border-divider bg-background-page sticky top-0 z-50 w-full border-b print:hidden">
      {/* Skip Navigation Link - Appx C.2 from wireframes.md */}
      <a
        href="#main-content"
        className="focus:bg-primary-focus focus:text-focus-indicator focus:ring-offset-focus-indicator sr-only focus:not-sr-only focus:absolute focus:top-full focus:left-4 focus:z-[9999] focus:p-3 focus:ring-2 focus:ring-offset-2"
      >
        {t("skipToMainContent")}
      </a>
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link
            passHref
            href="/"
            aria-label={t("logoAlt")}
            className="text-accent hover:text-primary-action-hover focus-visible:ring-ring flex items-center justify-center space-x-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <Logo
              aria-hidden="true" // Decorative if the Link has aria-label
              className="h-8 w-auto object-contain md:h-10" // Adjusted size for responsiveness
            />
            <h1 className="truncate text-lg font-extrabold md:text-xl">
              {t("siteName")}
            </h1>
          </Link>
        </div>

        {/* Center: Desktop Navigation - Hidden on smaller screens, shown on xl and up */}
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
                className={cn("hover:text-primary-action-hover relative", {
                  "text-primary-action border-primary-action hover:border-primary-action-hover border-2":
                    isSearchExpanded,
                })}
                variant="ghost"
                size="icon"
                aria-label={t("toggleSearchBar")}
                onClick={toggleSearchBar}
                aria-expanded={isSearchExpanded}
                aria-controls="desktop-search-input" // Controls the input field
                tooltipContent={t("toggleSearchBar")}
                tooltipSide="bottom"
              >
                <FiSearch className="h-5 w-5 text-inherit" aria-hidden="true" />
              </Button>
              <InputField
                id="desktop-search-input" // Added ID for aria-controls
                ref={searchRef}
                label={t("searchLabel")}
                hideLabel={true}
                type="search"
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchLabel")}
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
                    // Ensure focus ring is also hidden when collapsed
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
                >
                  <FiGlobe
                    className="h-5 w-5 text-inherit"
                    aria-hidden="true"
                  />
                </Button>
              }
              currentValue={language}
              items={availableLanguages}
              ariaLabel={t("languageSelection")}
            />

            {/* Theme Toggle */}
            <Button
              tooltipContent={
                isDarkMode ? t("switchToLightMode") : t("switchToDarkMode")
              }
              tooltipSide="bottom"
              className="hover:text-primary-action-hover"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-pressed={isDarkMode}
              aria-label={t(
                isDarkMode ? "switchToLightMode" : "switchToDarkMode",
              )}
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
            {/* Ensures this is only for mobile menu scenarios */}
            <Button
              ref={mobileMenuButtonRef}
              variant="ghost"
              size="icon"
              className={cn({
                "text-primary-action border-primary-action hover:text-feedback-error hover:border-feedback-error border-2":
                  isMobileMenuOpen,
                "hover:text-primary-action-hover": !isMobileMenuOpen,
              })}
              onClick={handleMobileMenuToggle}
              aria-controls="mobile-menu-drawer" // Link button to the drawer
              aria-expanded={isMobileMenuOpen}
              aria-label={t("toggleMobileMenu")}
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
        key={pathname + searchParams.toString()} // Ensure re-render on query param changes too for effects
        ref={mobileMenuDrawerRef} // Add ref for focus trapping
        tabIndex={-1}
        id="mobile-menu-drawer"
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
            {t("mobileMenuTitle")}
          </h2>
          {/* Mobile Search */}
          <div className="border-border-divider border-b pb-4 lg:hidden">
            <InputField
              ref={mobileSearchRef}
              label={t("searchLabel")}
              hideLabel={true}
              hint={<FiSearch aria-hidden="true" />}
              type="search"
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchLabel")}
              className="focus:ring-2 focus:outline-none"
            />
          </div>
          {/* Workaround for mobile menu spacing being added for hidden elements as well */}
          <div className="lg:-mb-2">{renderNavLinks(true)}</div>
          {/* Language and Theme Switcher for Mobile using Accordion */}
          <div className="border-border-divider border-t pt-4 lg:hidden">
            <Accordion
              items={useMemo(
                () => [mobileLocaleSwitcher, mobileThemeSwitcher],
                [mobileLocaleSwitcher, mobileThemeSwitcher],
              )}
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

export default React.memo(HeaderComponent);
