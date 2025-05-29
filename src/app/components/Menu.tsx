"use client";

import React, { Fragment } from "react";
import {
  Menu as HeadlessMenu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { cn } from "@utils/cn";
import Link from "next/link";
import { Button } from "@components/Button";
import { MenuProps } from "@typings/Menu";
import { Tooltip } from "@components/Tooltip";

const MenuComponent: React.FC<MenuProps> = ({
  trigger,
  items,
  ariaLabel,
  className,
  menuClassName,
  currentValue,
}) => {
  // TODO: Review focus styling for menu items to ensure alignment with the project's design system (e.g., `ring-2 ring-primary-action`).
  // The current background change on focus should meet contrast requirements.
  // TODO: Ensure custom colors like `bg-primary-action-alpha-50` and `bg-accent-alpha-50` are WCAG AAA compliant in tailwind.config.js.
  return (
    <HeadlessMenu
      as="div"
      className={cn("relative inline-block text-left", className)}
      defaultValue={currentValue}
    >
      <Tooltip content={ariaLabel} side="bottom">
        <MenuButton as={Fragment}>
          {({ active }) =>
            React.cloneElement(trigger, {
              "aria-expanded": active,
              "aria-label": ariaLabel,
              "aria-haspopup": "true",
            } as React.DOMAttributes<Element>)
          }
        </MenuButton>
      </Tooltip>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          className={cn(
            "bg-background-page ring-opacity-5 xs:w-56 absolute right-0 z-50 mt-2 w-full max-w-xs origin-top-right rounded-md p-1 shadow-lg ring-1 ring-black focus:outline-none sm:w-64",
            menuClassName,
          )}
          aria-label={ariaLabel}
        >
          {items.map((item, index) => {
            if (item.isSeparator) {
              // TODO: Review focus styling for menu items to ensure alignment with the project's design system (e.g., `ring-2 ring-primary-action`).
              // The current background change on focus should meet contrast requirements.
              // TODO: Ensure custom colors like `bg-primary-action-alpha-50` and `bg-accent-alpha-50` are WCAG AAA compliant in tailwind.config.js.
              return (
                <hr
                  key={`sep-${index}`}
                  className="border-border-divider my-1"
                />
              );
            }

            const content = ({ focus }: { focus: boolean }) => (
              <span
                className={cn(
                  "flex w-full items-center justify-start truncate rounded-md px-4 py-2 text-sm",
                  {
                    "bg-primary-action text-background-page":
                      focus && !item.value && !currentValue && !item.disabled,
                    // Styles for focused disabled items - ensure these custom alpha colors are accessible
                    "bg-primary-action-alpha-50":
                      item.disabled && focus && !item.value && !currentValue,
                    "bg-accent text-background-page":
                      !item.disabled &&
                      (item.value || currentValue) &&
                      (focus || item.value === currentValue),
                    // Styles for focused disabled items with value/currentValue - ensure these custom alpha colors are accessible
                    "bg-accent-alpha-50":
                      item.disabled &&
                      (item.value || currentValue) &&
                      (focus || item.value === currentValue),
                    // Ensure disabled items have sufficient contrast.
                    // Replace opacity-50 with specific text/background colors if needed for AAA compliance.
                    // For example, use a specific text color like 'text-neutral-500' (if defined and accessible)
                    // and potentially a 'bg-neutral-100' if opacity causes issues.
                    // The current approach relies on the text color used for non-disabled items, which might become non-compliant with opacity.
                    // For now, retaining opacity-50 as per "styles remain intact" but flagging for review.
                    "cursor-not-allowed opacity-50": item.disabled,
                    "text-disabled-control": item.disabled, // Example: Using a specific color for disabled text for better contrast control than just opacity. Ensure 'text-muted-foreground' is WCAG compliant.
                  },
                )}
              >
                {item.icon && (
                  <item.icon className="mr-2 h-5 w-5" aria-hidden="true" />
                )}
                {item.label}
              </span>
            );

            // TODO: Review focus styling for menu items to ensure alignment with the project's design system (e.g., `ring-2 ring-primary-action`).
            // The current background change on focus should meet contrast requirements.
            // TODO: Ensure custom colors like `bg-primary-action-alpha-50` and `bg-accent-alpha-50` are WCAG AAA compliant in tailwind.config.js.
            return (
              <MenuItem key={item.label || index} disabled={item.disabled}>
                {({ focus }) =>
                  item.href ? (
                    <Link href={item.href} aria-disabled={item.disabled}>
                      {content({ focus })}
                    </Link>
                  ) : item.isButton ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={item.onClick}
                      disabled={item.disabled}
                      className="w-full p-0 text-left text-sm"
                    >
                      {content({ focus })}
                    </Button>
                  ) : (
                    <Link href="#" onClick={close}>
                      {content({ focus })}
                    </Link>
                  )
                }
              </MenuItem>
            );
          })}
        </MenuItems>
      </Transition>
    </HeadlessMenu>
  );
};

export const Menu = React.memo(MenuComponent);
export default Menu;
