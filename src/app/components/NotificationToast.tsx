"use client";

import React, { Fragment } from "react";
import { Transition } from "@headlessui/react";
import {
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";
import { cn } from "@utils/cn";
import { useTranslations } from "next-intl"; // Import useTranslations
import { Button } from "@components/Button";
import hotToast, {
  Renderable,
  Toast,
  resolveValue,
  type Toast as RHTToast,
} from "react-hot-toast"; // Import react-hot-toast

export type NotificationType = "success" | "error" | "info" | "warning";

export interface NotificationToastProps {
  toast: RHTToast; // react-hot-toast object
  type: NotificationType;
  title: string;
  message?: Renderable;
  className?: string;
}

const icons: Record<NotificationType, React.ElementType> = {
  success: FiCheckCircle,
  error: FiXCircle,
  info: FiInfo,
  warning: FiAlertTriangle,
};

const typeClasses: Record<NotificationType, string> = {
  success: "bg-feedback-success/10 text-feedback-success", // Use design system colors
  error: "bg-feedback-error/10 text-feedback-error", // Use design system colors
  info: "bg-primary-action/10 text-primary-action", // Use design system colors (using primary for info)
  warning: "bg-feedback-warning/10 text-feedback-warning", // Use design system colors
};

const iconClasses: Record<NotificationType, string> = {
  success: "text-feedback-success", // Use design system colors
  error: "text-feedback-error", // Use design system colors
  info: "text-primary-action", // Use design system colors (using primary for info)
  warning: "text-feedback-warning", // Use design system colors
};

const NotificationToast: React.FC<NotificationToastProps> = ({
  toast, // Destructure toast object
  type,
  title,
  message,
  className,
}) => {
  const Icon = icons[type];
  const t = useTranslations("Common"); // Initialize translations
  const toastType = (t: Toast) => {
    return t.type === "error"
      ? "error"
      : t.type === "success"
        ? "success"
        : "info";
  };
  type = type || toastType(toast);
  title = title || t(`notification.${type}`);
  message = message || resolveValue(toast.message, toast);

  const handleDismiss = () => {
    hotToast.dismiss(toast.id);
  };

  const getLiveRegionProps = () => {
    switch (type) {
      case "error":
      case "warning":
        return { role: "alert", "aria-live": "assertive" as "assertive" };
      case "success":
      case "info":
      default:
        return { role: "status", "aria-live": "polite" as "polite" };
    }
  };

  return (
    <Transition
      show={toast.visible} // Use toast.visible for show state
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        {...getLiveRegionProps()} // Add ARIA live region props
        aria-atomic="true" // Ensure the whole message is read by screen readers
        className={cn(
          "bg-background-page ring-opacity-5 pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black", // Use background-page
          className,
          typeClasses[type], // Apply type-specific background/text tint
        )}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon
                className={cn("h-6 w-6", iconClasses[type])}
                aria-hidden="true"
              />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-text-heading text-sm font-medium">{title}</p>
              {/* Use text-heading */}
              {message && (
                <p className="mt-1 text-sm">{message}</p> // Use text-body
              )}
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="p-1.5"
                onClick={handleDismiss}
                aria-label={t("close")} // Added for accessibility
              >
                <FiX size={20} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export { NotificationToast };
