import React from "react";
import Link from "next/link"; // Assuming Next.js for routing
import { FiChevronRight } from "react-icons/fi";
import { cn } from "@utils/cn";
import { useTranslations } from "next-intl"; // Import useTranslations

export interface BreadcrumbItem {
  label: string;
  href?: string; // Optional: If not provided, it's the current page
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  const t = useTranslations("Breadcrumbs"); // Initialize translations

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label={t("breadcrumbNavLabel")} // Use translation key
      className={cn("text-text-secondary text-sm", className)} // Use text-secondary
    >
      <ol className="flex items-center space-x-1 md:space-x-2">
        {items.map((item, index) => {
          item.href = item.href || "#";
          return (
            <li key={index} className="inline-flex items-center">
              {index > 0 && (
                <FiChevronRight
                  className="text-text-secondary mx-1 h-4 w-4 flex-shrink-0" // Use text-secondary
                  aria-hidden="true"
                />
              )}
              {index < items.length - 1 ? (
                <Link href={item.href}>
                  <a className="focus-visible:ring-ring rounded hover:underline focus:outline-none focus-visible:ring-1">
                    {item.label}
                  </a>
                </Link>
              ) : (
                <span
                  aria-current="page"
                  className="text-foreground font-medium"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export { Breadcrumbs };
