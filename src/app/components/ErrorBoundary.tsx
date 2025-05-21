"use client";

import React, { ErrorInfo } from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { Button } from "@components/Button";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import type { FallbackProps } from "react-error-boundary";

// Receive error and resetErrorBoundary via FallbackProps
const ErrorBoundaryDisplay: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const t = useTranslations("ErrorBoundary");

  // Use the resetErrorBoundary function passed from the library
  const handleReset = () => {
    resetErrorBoundary();
    // Optional: Add other reset logic if needed, e.g., clear state, navigate
    // window.location.reload(); // Avoid full reload if possible
  };

  return (
    <div
      role="alert"
      className="bg-feedback-error/10 flex min-h-screen flex-col items-center justify-center gap-4 rounded-lg p-4 text-center"
      aria-labelledby="error-boundary-heading"
    >
      <FiAlertTriangle
        className="text-feedback-error h-12 w-12"
        aria-hidden="true"
      />
      <h2
        id="error-boundary-heading"
        className="text-text-heading text-xl font-semibold"
      >
        {t("errorBoundaryTitle")}
      </h2>
      {error && <p className="text-feedback-error text-sm">{error.message}</p>}
      {/* Optionally show stack in development */}
      {process.env.NODE_ENV === "development" && error?.stack && (
        <details className="mt-2 w-full max-w-md text-left">
          <summary className="text-text-secondary cursor-pointer text-sm">
            {t("componentStackLabel")}
          </summary>
          <pre className="bg-background-subtle mt-1 overflow-auto rounded p-2 font-mono text-xs">
            {error.stack}
          </pre>
        </details>
      )}
      <Button
        onClick={handleReset}
        variant="primary"
        className="mt-4"
        aria-label={t("tryAgainButton")}
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
    console.log("Error boundary reset triggered.");
    // Example: window.location.assign(window.location.origin);
  };

  const handleError = (error: Error, info: ErrorInfo) => {
    // Log the error to an error reporting service
    // Example: logErrorToMyService(error, info.componentStack);
    console.error("Caught by Error Boundary:", error, info);
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorBoundaryDisplay} // Use the display component as fallback
      onReset={handleReset} // Called when resetErrorBoundary is invoked
      onError={handleError} // Optional: Log errors
    >
      {children}
    </ReactErrorBoundary>
  );
};

// Export the wrapper component to be used in the app layout
export default AppErrorBoundary;
