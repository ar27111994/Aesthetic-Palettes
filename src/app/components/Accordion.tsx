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
  id: string | number;
  title: React.ReactNode;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  itemClassName?: string;
  buttonClassName?: string;
  panelClassName?: string;
}

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
          className={cn("bg-background-subtle rounded-lg p-2", itemClassName)} // Use background-subtle
        >
          {({ open }) => (
            <>
              <DisclosureButton
                className={cn(
                  "bg-primary-action/10 text-primary-action hover:bg-primary-action/20 focus-visible:outline-focus-indicator flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2", // Use primary-action, focus-indicator
                  buttonClassName,
                )}
              >
                <span>{item.title}</span>
                <FiChevronUp
                  aria-hidden="true"
                  className={cn(
                    "text-primary-action h-5 w-5 transition-transform duration-200 motion-reduce:transition-none", // Use primary-action
                    { "rotate-180 transform": open },
                  )}
                />
              </DisclosureButton>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <DisclosurePanel
                  className={cn(
                    "px-4 pt-4 pb-2 text-sm", // Use text-body
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
