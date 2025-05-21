// app/generator/components/controls/MoreOptionsDropdown.tsx
import React, { Fragment } from "react";
import { Button } from "@components/Button";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { FiSettings } from "react-icons/fi";
import { cn } from "@utils/cn";

export interface MoreOptionItemConfig {
  id: string;
  label: string; // Pre-translated label
  icon: React.ElementType;
  handler: () => void;
  disabled?: boolean;
}

export interface MoreOptionsSectionConfig {
  id: string;
  items: MoreOptionItemConfig[];
}

interface MoreOptionsDropdownProps {
  sections: MoreOptionsSectionConfig[];
  moreOptionsLabel: string;
}

export const MoreOptionsDropdown: React.FC<MoreOptionsDropdownProps> = ({
  sections,
  moreOptionsLabel,
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton
          as={Button}
          variant="ghost"
          size="icon"
          aria-label={moreOptionsLabel}
        >
          <FiSettings className="h-5 w-5" />
        </MenuButton>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="bg-background-page divide-border-divider ring-opacity-5 absolute right-0 bottom-full z-10 mb-2 w-56 origin-bottom-right divide-y rounded-md shadow-lg ring-1 ring-black focus:outline-none sm:right-auto sm:left-0 sm:origin-bottom-left">
          {sections.map((section, sectionIndex) => (
            <div
              className="px-1 py-1"
              key={section.id || `section-${sectionIndex}`}
            >
              {section.items.map((item) => (
                <MenuItem key={item.id} disabled={item.disabled}>
                  {({ active, disabled }) => (
                    <button
                      onClick={item.handler}
                      disabled={disabled}
                      className={cn(
                        "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                        {
                          "bg-primary-action text-background-page": active,
                          "text-text-body": !active,
                          "cursor-not-allowed opacity-50": disabled,
                        },
                      )}
                    >
                      <item.icon className="mr-2 h-5 w-5" aria-hidden="true" />
                      {item.label}
                    </button>
                  )}
                </MenuItem>
              ))}
            </div>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
};
