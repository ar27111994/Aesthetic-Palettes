// app/palettes/[id]/components/FullscreenControls.tsx
import React, { useEffect, useRef, forwardRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useAriaAnnouncer } from "@lib/hooks/useAriaAnnouncer";
import { useFullscreenOnViewModeToggle } from "@hooks/useFullscreenOnViewModeToggle";
import { cn } from "@utils/cn";

/**
 * Checks if the browser supports the Fullscreen API.
 * @returns {boolean} True if fullscreen is supported, false otherwise.
 */
const isFullscreenSupported = (): boolean =>
  !!(
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled
  );

/**
 * Props for the AccessibleButton component.
 * @interface AccessibleButtonProps
 */
interface AccessibleButtonProps {
  onClick: () => void;
  label: string;
  icon: React.ElementType;
  className?: string;
  disabled?: boolean;
}

/**
 * AccessibleButton component for fullscreen controls.
 * @component
 * @param {AccessibleButtonProps} props - The properties for the component.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref for the button element.
 * @returns {JSX.Element} The rendered AccessibleButton component.
 */
const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ onClick, label, icon: Icon, className, disabled }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cn(
        "text-foreground/70 hover:bg-foreground/10 focus:ring-foreground/50 rounded-full p-2 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none",
        className,
        { "cursor-not-allowed opacity-50": disabled },
      )}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  ),
);

AccessibleButton.displayName = "AccessibleButton";

/**
 * Props for the FullscreenControls component.
 * @interface FullscreenControlsProps
 */
interface FullscreenControlsProps {
  onClose?: () => void;
  className?: string;
}

/**
 * FullscreenControls component renders controls for managing fullscreen mode.
 * @component
 * @param {FullscreenControlsProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered FullscreenControls component.
 */
export const FullscreenControls: React.FC<FullscreenControlsProps> = ({
  onClose,
  className,
}) => {
  const t = useTranslations("Fullscreen");
  const tCommon = useTranslations("common");
  const announce = useAriaAnnouncer();
  const { toggleFullscreen, isFullscreen } = useFullscreenOnViewModeToggle();
  const controlsRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check browser support
  useEffect(() => {
    setIsSupported(isFullscreenSupported());
  }, []);

  // Focus management
  useEffect(() => {
    if (closeButtonRef.current && isFullscreen) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        e.preventDefault();
        handleClose();
      } else if (e.key === "Tab" && controlsRef.current) {
        const focusableElements = Array.from(
          controlsRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => !el.hasAttribute("disabled"));
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement as HTMLElement;
        if (e.shiftKey && activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Handle close button click
  const handleClose = async () => {
    if (!isSupported) {
      onClose?.();
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await toggleFullscreen();
      announce(
        t("exitingFullscreen", { defaultValue: "Exiting fullscreen mode" }),
      );
      onClose?.();
    } catch (err) {
      console.error("Error exiting fullscreen:", err);
      setError(
        tCommon("fullscreenExitError", {
          defaultValue: "Error exiting fullscreen mode",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Icons
  const XIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  return (
    <div
      ref={controlsRef}
      className={cn(
        "absolute top-0 right-0 z-50 flex gap-2 p-2 opacity-0 transition-opacity duration-200 focus-within:opacity-100 hover:opacity-100",
        className,
      )}
      role="toolbar"
      aria-label={t("controls.label", { defaultValue: "Fullscreen controls" })}
    >
      {isSupported !== false ? (
        <AccessibleButton
          ref={closeButtonRef}
          onClick={handleClose}
          label={t("controls.close", { defaultValue: "Close fullscreen" })}
          icon={XIcon}
          disabled={isLoading}
          className="text-red-500 hover:bg-red-500/10 focus:ring-red-500/50"
        />
      ) : (
        <div
          className="flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700"
          role="alert"
          aria-live="polite"
        >
          <span className="mr-1">⚠️</span>
          {tCommon("fullscreenNotSupported", {
            defaultValue: "Fullscreen not supported",
          })}
        </div>
      )}
      {error && isSupported && (
        <div
          className="absolute top-full right-0 mt-2 rounded-md bg-red-100 px-3 py-1 text-sm text-red-700"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
    </div>
  );
};
FullscreenControls.displayName = "FullscreenControls";
