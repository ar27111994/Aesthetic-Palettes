"use client";

import React, { Fragment, useRef } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { FiX } from "react-icons/fi";
import { cn } from "@utils/cn";
import { SizeVariant } from "@typings/Size";
import { useTranslations } from "next-intl"; // Import useTranslations
import { Button } from "@components/Button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode; // Optional footer content
  titleId?: string;
  descriptionId?: string;
  className?: string;
  size?: SizeVariant;
}

const ModalComponent: React.FC<ModalProps> = ({
  // Renamed for React.memo
  isOpen,
  onClose,
  title,
  children,
  footer,
  titleId: providedTitleId,
  descriptionId: providedDescriptionId,
  className,
  size = "md",
}) => {
  const uniqueId = React.useId(); // Generate ID once, not conditionally
  const titleId = providedTitleId || `modal-title-${uniqueId}`;
  const descriptionId =
    providedDescriptionId || `modal-description-${uniqueId}`;
  const initialFocusRef = useRef(null); // Ref for initial focus inside the modal
  const t = useTranslations("Common"); // Initialize translations

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full",
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50" // Ensure high z-index
        initialFocus={initialFocusRef} // Set initial focus
        onClose={onClose}
      >
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="bg-overlay-dark-alpha-50 fixed inset-0"
            aria-hidden="true"
          />
        </TransitionChild>

        {/* Modal Panel Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className={cn(
                  "bg-background-page w-full transform overflow-hidden rounded-lg p-6 text-left align-middle shadow-xl transition-all motion-reduce:transition-none", // Use background-page
                  sizeClasses[size],
                  className,
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId} // Describe content if applicable
              >
                <div className="flex items-center justify-between">
                  <DialogTitle
                    as="h3"
                    id={titleId}
                    className="text-text-heading text-lg leading-6 font-medium" // Use text-heading
                  >
                    {title}
                  </DialogTitle>
                  <Button
                    tooltipContent={t("closeModalLabel")}
                    variant="ghost"
                    size="icon"
                    className="ml-4"
                    onClick={onClose}
                  >
                    <FiX className="h-6 w-6" aria-hidden="true" />
                  </Button>
                </div>

                <div id={descriptionId} className="mt-4">
                  {/* Add a ref to a focusable element if possible, e.g., to the first interactive element in children for initialFocus. */}
                  {/* TODO: Ensure content passed as children meets WCAG AA/AAA contrast requirements against the modal background. */}
                  {children}
                </div>

                {/* Render footer if provided */}
                {footer && (
                  <div className="border-border-neutral mt-5 border-t pt-4 sm:mt-6">
                    {footer}
                  </div>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const Modal = React.memo(ModalComponent);
export { Modal };
