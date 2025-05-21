"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "@utils/cn";
import { useTranslations } from "next-intl"; // Import useTranslations

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  className?: string;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  className,
}) => {
  const t = useTranslations("Pagination"); // Initialize translations

  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page or less
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const buttonBaseClasses =
    "relative inline-flex items-center rounded-md border border-border-divider bg-background-page px-2 py-2 text-sm font-medium text-text-secondary hover:bg-background-subtle focus:z-20 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-indicator disabled:text-disabled-control disabled:bg-disabled-bg disabled:cursor-not-allowed"; // Use design system colors and focus

  return (
    <div
      className={cn(
        "border-border-divider bg-background-page flex items-center justify-between border-t px-4 py-3 sm:px-6", // Use design system colors
        className,
      )}
      aria-label="Pagination"
    >
      {/* Mobile View */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="border-border-divider bg-background-page hover:bg-background-subtle disabled:text-disabled-control disabled:bg-disabled-bg focus-visible:outline-focus-indicator relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed" // Use design system colors and focus
        >
          {t("previousButtonMobile")} {/* Use translation key */}
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="border-border-divider bg-background-page hover:bg-background-subtle disabled:text-disabled-control disabled:bg-disabled-bg focus-visible:outline-focus-indicator relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed" // Use design system colors and focus
        >
          {t("nextButtonMobile")} {/* Use translation key */}
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm">
            {/* Use text-body */}
            {t("showingResults", { startItem, endItem, totalItems })}
            {/* Showing <span className="font-medium">{startItem}</span> to
            <span className="font-medium">{endItem}</span> of
            <span className="font-medium">{totalItems}</span> results */}
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={cn(buttonBaseClasses, "rounded-l-md")}
              aria-label={t("previousButtonAriaLabel")} // Use translation key
            >
              <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {/* Current page indicator (optional, can add page numbers later) */}
            <span
              aria-current="page"
              className="border-primary-action bg-primary-action/10 text-primary-action focus-visible:outline-focus-indicator relative z-10 inline-flex items-center border px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2" // Use primary-action and focus
            >
              {currentPage}
            </span>
            {/* Add more page numbers here if needed */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={cn(buttonBaseClasses, "rounded-r-md")}
              aria-label={t("nextButtonAriaLabel")} // Use translation key
            >
              <FiChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export { PaginationControls };
