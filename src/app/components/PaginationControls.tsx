"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "@utils/cn";
import { useTranslations } from "next-intl"; // Import useTranslations
import { Button } from "@components/Button"; // Import the shared Button component

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  className?: string;
  siblingCount?: number; // Number of page buttons to show around the current page
}

const DOTS = "...";

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  className,
  siblingCount = 1, // Default to 1 sibling page button on each side
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

  // Helper function to generate page numbers with ellipses
  const generatePageNumbers = () => {
    const totalPageNumbers = siblingCount + 5; // siblingCount + firstPage + lastPage + currentPage + 2*DOTS

    // Case 1: If the number of pages is less than the page numbers we want to show in our paginationComponent
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, lastPageIndex];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      );
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
    // Should not happen, but as a fallback
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const pageNumbers = generatePageNumbers();

  const currentPageClasses =
    "border-primary-action bg-primary-action/10 text-primary-action z-10 focus:outline-none"; // Ensure Button's focus doesn't override this if needed

  return (
    <div
      className={cn(
        "border-border-divider bg-background-page flex items-center justify-between border-t px-4 py-3 sm:px-6", // Use design system colors
        className,
      )}
      aria-label={t("paginationRootAriaLabel")}
    >
      {/* Mobile View - Using Button for consistency */}
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          variant="outline" // Using Button's variant
          size="default" // Using Button's size, px-4 py-2 matches pageButtonClasses
          className="disabled:cursor-not-allowed" // Keep specific disabled style if Button's default is not enough
        >
          {t("previousButtonMobile")}
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          variant="outline"
          size="default"
          className="ml-3 disabled:cursor-not-allowed"
        >
          {t("nextButtonMobile")}
        </Button>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-text-body text-sm">
            {/* Use text-body from design system */}
            {t("showingResults", { startItem, endItem, totalItems })}
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label={t("paginationNavAriaLabel")}
          >
            <Button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              variant="outline"
              size="sm" // px-2 py-2 matches buttonBaseClasses for icons
              className="rounded-l-md"
              aria-label={t("previousButtonAriaLabel")} // Retained for clarity
              tooltipContent={t("previousButtonAriaLabel")}
            >
              <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Button>

            {pageNumbers.map((page, index) => {
              if (page === DOTS) {
                return (
                  <span
                    key={`${page}-${index}`}
                    className="border-border-divider bg-background-page text-text-secondary relative inline-flex items-center border px-4 py-2 text-sm font-medium"
                  >
                    {DOTS}
                  </span>
                );
              }
              const isCurrent = page === currentPage;
              return (
                <Button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  disabled={isCurrent}
                  variant="outline"
                  size="default" // px-4 py-2 matches pageButtonClasses
                  className={cn(
                    { [currentPageClasses]: isCurrent },
                    "disabled:cursor-not-allowed", // Keep specific disabled style
                    // Remove rounded-md if it's part of a group, Button.tsx adds rounded-md by default
                    // For first/last visible page button in sequence, apply rounded-l-md/rounded-r-md if not prev/next
                    // This logic might be complex to add here, Button.tsx default rounding might be acceptable
                  )}
                  aria-label={t("goToPageAriaLabel", { pageNumber: page })}
                  aria-current={isCurrent ? "page" : undefined}
                  tooltipContent={t("goToPageAriaLabel", { pageNumber: page })}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm" // px-2 py-2 matches buttonBaseClasses for icons
              className="rounded-r-md"
              aria-label={t("nextButtonAriaLabel")}
              tooltipContent={t("nextButtonAriaLabel")}
            >
              <FiChevronRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export { PaginationControls };
