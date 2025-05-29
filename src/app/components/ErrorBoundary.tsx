"use client";

import React, { ErrorInfo } from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { Button } from "@components/Button";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import type { FallbackProps } from "react-error-boundary";
import { useRouter } from "next/navigation";

// Receive error and resetErrorBoundary via FallbackProps
const ErrorBoundaryDisplay: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const t = useTranslations("ErrorBoundary");
  const router = useRouter();

  // Use the resetErrorBoundary function passed from the library
  const handleReset = () => {
    resetErrorBoundary();
    // Optional: Add other reset logic if needed, e.g., clear state, navigate
    router.refresh(); // Avoid full reload if possible
  };

  return (
    <div
      role="alert"
      // Ensure this container's responsive design is effective on all screen sizes.
      // Tailwind classes used (flex, min-h-screen, p-4, gap-4) support responsiveness.
      className="bg-feedback-error/10 flex min-h-screen flex-col items-center justify-center gap-4 rounded-lg p-4 text-center"
      aria-labelledby="error-boundary-heading"
    >
      {/* WCAG AAA Contrast: Ensure icon color 'text-feedback-error' (and its hover/focus states if interactive) 
          has a contrast ratio of at least 4.5:1 against 'bg-feedback-error/10'. 
          Verify with a contrast checker. For non-text, 3:1 is AA. Aim for higher if possible. */}
      <FiAlertTriangle
        className="text-feedback-error h-12 w-12"
        aria-hidden="true" // Appropriate as the error is described by text.
      />
      {/* WCAG AAA Contrast: Ensure heading 'text-text-heading' has a contrast ratio of at least 4.5:1 (large text) 
          or 7:1 (if considered normal text size after responsiveness) against 'bg-feedback-error/10'. 
          Verify with a contrast checker. */}
      <h2
        id="error-boundary-heading"
        className="text-text-heading text-xl font-semibold"
      >
        {t("errorBoundaryTitle")}
      </h2>
      {/* WCAG AAA Contrast: Ensure error message 'text-feedback-error' has a contrast ratio of at least 7:1 
          against 'bg-feedback-error/10'. Consider a more prominent display for critical error messages. 
          Verify with a contrast checker. */}
      {error && (
        <p className="text-feedback-error text-base font-medium">
          {error.message}
        </p>
      )}{" "}
      {/* Adjusted text-sm to text-base and added font-medium for better readability */}
      {/* Optionally show stack in development */}
      {process.env.NODE_ENV === "development" && error?.stack && (
        // The 'details' and 'summary' elements are inherently keyboard accessible.
        // Ensure focus indicators are highly visible as per project guidelines (e.g., distinct outline).
        <details className="mt-2 w-full max-w-md text-left">
          {/* WCAG AAA Contrast: Ensure summary 'text-text-secondary' has a contrast ratio of at least 7:1 
              against 'bg-feedback-error/10'. Verify with a contrast checker. */}
          <summary className="text-text-secondary focus:ring-primary-focus cursor-pointer text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none">
            {" "}
            {/* Added example focus style, adapt to project's focus system */}
            {t("componentStackLabel")}
          </summary>
          {/* WCAG AAA Contrast: Ensure preformatted text has a contrast ratio of at least 7:1 
              against 'bg-background-subtle'. Verify with a contrast checker. */}
          <pre className="bg-background-subtle mt-1 overflow-auto rounded p-2 font-mono text-xs">
            {error.stack}
          </pre>
        </details>
      )}
      {/* Ensure this Button component adheres to project's accessibility standards for focus indicators, 
          keyboard operation, and ARIA attributes (likely handled within Button.tsx). */}
      <Button
        onClick={handleReset}
        variant="primary"
        className="mt-4"
        aria-label={t("tryAgainButton")} // Good for accessibility
      >
        <FiRefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
        {t("tryAgainButton")}
      </Button>
    </div>
  );
};

// The actual Error Boundary component using the library
interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({ children }) => {
  const handleReset = () => {
    // Reset the state of your app so the error doesn't happen again
    // This might involve clearing global state, navigating away, etc.
    // This is a critical part of making the "Try Again" functionality effective.
    console.log(
      "Error boundary reset triggered. Implement app-specific reset logic here.",
    );
    // Example: window.location.assign(window.location.origin); // Or more granular state reset
  };

  const handleError = (error: Error, info: ErrorInfo) => {
    // Log the error to an error reporting service
    // Example: logErrorToMyService(error, info.componentStack);
    // This is crucial for monitoring and debugging production errors.
    console.error("Caught by Error Boundary:", error, info);
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorBoundaryDisplay} // Use the display component as fallback
      onReset={handleReset} // Called when resetErrorBoundary is invoked from FallbackComponent
      onError={handleError} // Optional: Log errors to a reporting service
      // Consider adding a resetKeys prop if errors depend on certain props/state that can change
      // and should trigger a re-render attempt of children rather than showing fallback.
    >
      {children}
    </ReactErrorBoundary>
  );
};

// Export the wrapper component to be used in the app layout
export default AppErrorBoundary;
