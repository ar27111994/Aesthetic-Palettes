"use client";

import React, { Fragment } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from "@headlessui/react";
import { FiChevronUp } from "react-icons/fi";
import { cn } from "@utils/cn";

export interface AccordionItem {
  id: string | number; // Used as a key, ensure stability if used for other purposes like deep linking.
  title: React.ReactNode; // For SEO, if this title represents a heading, wrap it in <hN> tags when passing the prop.
  content: React.ReactNode; // Ensure content is semantically structured for accessibility and SEO.
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string; // Custom class for the root container.
  itemClassName?: string; // Custom class for each accordion item's container.
  buttonClassName?: string; // Custom class for each accordion button.
  panelClassName?: string; // Custom class for each accordion panel.
}

/**
 * Accordion component built with Headless UI for accessibility.
 * - Handles keyboard navigation (Tab, Shift+Tab, Enter, Space) automatically.
 * - Applies ARIA attributes (`aria-expanded`, `aria-controls`) as per WAI-ARIA practices.
 * - Supports responsive design through Tailwind CSS utility classes.
 * - WCAG contrast compliance depends on the theme variables used (e.g., `bg-primary-action`, `text-foreground-muted`).
 * - Performance is generally good due to Headless UI's optimizations.
 * - For SEO, ensure semantic HTML (e.g., headings) is used within the `title` and `content` props passed to items.
 */
const Accordion: React.FC<AccordionProps> = ({
  items,
  className,
  itemClassName,
  buttonClassName,
  panelClassName,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={cn("w-full space-y-2", className)}>
      {items.map((item) => (
        <Disclosure
          key={item.id}
          defaultOpen={item.defaultOpen}
          as="div"
          // Each item's wrapper. Styled with theme's `bg-background-subtle`.
          className={cn("bg-background-subtle rounded-lg p-2", itemClassName)}
        >
          {({ open }) => (
            <>
              <DisclosureButton
                className={cn(
                  // Styling ensures button is clearly interactive and uses theme colors.
                  // `focus-visible:outline-focus-indicator` is crucial for keyboard accessibility (WCAG 2.4.7).
                  "bg-primary-action/10 text-primary-action hover:bg-primary-action/20 focus-visible:outline-focus-indicator flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
                  buttonClassName,
                )}
              >
                <span>{item.title}</span>
                <FiChevronUp
                  aria-hidden="true" // Icon is decorative as button text provides the label.
                  className={cn(
                    // Chevron icon indicates open/closed state, respects reduced motion preferences.
                    "text-primary-action h-5 w-5 transition-transform duration-200 motion-reduce:transition-none",
                    { "rotate-180 transform": open }, // Conditional rotation for visual feedback.
                  )}
                />
              </DisclosureButton>
              <Transition
                as={Fragment} // Ensures no extra DOM element is rendered by Transition itself.
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <DisclosurePanel
                  // Panel content styling, uses theme's `text-foreground-muted` for text color.
                  // Ensure this color has sufficient contrast against `bg-background-subtle` or panel's effective background.
                  className={cn(
                    "text-disabled-control px-4 pt-4 pb-2 text-sm",
                    panelClassName,
                  )}
                >
                  {item.content}
                </DisclosurePanel>
              </Transition>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
};

export { Accordion };
