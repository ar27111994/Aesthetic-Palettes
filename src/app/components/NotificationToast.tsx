"use client";

import React, { Fragment, useEffect, useState } from "react";
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

export type NotificationType = "success" | "error" | "info" | "warning";

export interface NotificationToastProps {
  id: string | number;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // Duration in ms, 0 or undefined means persistent
  onDismiss: (id: string | number) => void;
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
  id,
  type,
  title,
  message,
  duration,
  onDismiss,
  className,
}) => {
  const [show, setShow] = useState(true);
  const Icon = icons[type];
  const t = useTranslations("Common"); // Initialize translations

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        // Allow time for fade-out animation before calling onDismiss
        setTimeout(() => onDismiss(id), 300); // Adjust timing based on transition duration
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  const handleDismiss = () => {
    setShow(false);
    setTimeout(() => onDismiss(id), 300); // Adjust timing
  };

  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
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
              <button
                type="button"
                className="bg-background-page text-text-secondary hover:text-text-body focus-visible:ring-focus-indicator inline-flex rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none" // Use design system colors and focus
                onClick={handleDismiss}
                aria-label={t("dismissNotificationLabel")} // Use translation key
              >
                <FiX className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export { NotificationToast };
