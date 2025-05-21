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

const Menu: React.FC<MenuProps> = ({
  trigger,
  items,
  ariaLabel,
  className,
  menuClassName,
  currentValue,
}) => {
  return (
    <HeadlessMenu
      as="div"
      className={cn("relative inline-block text-left", className)}
      defaultValue={currentValue}
    >
      <MenuButton as={Fragment}>
        {({ active }) =>
          React.cloneElement(trigger, {
            "aria-expanded": active,
            "aria-label": ariaLabel,
            "aria-haspopup": "true",
          } as React.DOMAttributes<Element>)
        }
      </MenuButton>

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
            "bg-background-page ring-opacity-5 absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-md p-1 shadow-lg ring-1 ring-black focus:outline-none",
            menuClassName,
          )}
          aria-label={ariaLabel}
        >
          {items.map((item, index) => {
            if (item.isSeparator) {
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
                      focus && !item.value && !currentValue,
                    "bg-primary-action-alpha-50":
                      item.disabled && focus && !item.value && !currentValue,
                    "bg-accent text-background-page":
                      !item.disabled &&
                      (item.value || currentValue) &&
                      (focus || item.value === currentValue),
                    "bg-accent-alpha-50":
                      item.disabled &&
                      (item.value || currentValue) &&
                      (focus || item.value === currentValue),
                    "cursor-not-allowed opacity-50": item.disabled,
                  },
                )}
              >
                {item.icon && (
                  <item.icon className="mr-2 h-5 w-5" aria-hidden="true" />
                )}
                {item.label}
              </span>
            );

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

export default Menu;
