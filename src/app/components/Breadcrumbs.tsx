import React from "react";
import Link from "next/link"; // Assuming Next.js for routing
import { FiChevronRight } from "react-icons/fi";
import { cn } from "@utils/cn";
import { useTranslations } from "next-intl"; // Import useTranslations

export interface BreadcrumbItem {
  label: string;
  href?: string; // Optional: If not provided, it's the current page
}

interface JsonLdListItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item?: string; // URL of the breadcrumb item, optional
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  /** Base URL for constructing full URLs for JSON-LD, e.g., https://example.com */
  baseUrl?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
  baseUrl = "",
}) => {
  const t = useTranslations("Breadcrumbs"); // Initialize translations

  if (!items || items.length === 0) {
    return null;
  }

  // Prepare JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index): JsonLdListItem => {
      const listItem: JsonLdListItem = {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
      };
      // Assign item URL only if href is present, meaningful, and not just "#"
      if (item.href && item.href !== "#") {
        listItem.item = item.href.startsWith("http")
          ? item.href
          : `${baseUrl}${item.href}`;
      }
      // 'item' for the current page (last item, no distinct href) will be undefined here by default.
      // The logic below ensures it's explicitly removed if it somehow got set.
      return listItem;
    }),
  };

  // Ensure the 'item' property (URL) is omitted for the last breadcrumb if it represents the current page.
  if (jsonLd.itemListElement.length > 0) {
    const lastItemIndex = jsonLd.itemListElement.length - 1;
    const lastAppItem = items[lastItemIndex]; // Corresponding item from the input props
    // If the last app item represents the current page (no distinct href)
    if (!lastAppItem.href || lastAppItem.href === "#") {
      // The 'item' property on JsonLdListItem is optional, so 'delete' is type-safe.
      delete jsonLd.itemListElement[lastItemIndex].item;
    }
  }

  return (
    <>
      {/* 
        SEO: BreadcrumbList structured data.
        Ensure `baseUrl` prop is provided if your `item.href` values are relative paths.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 
        Accessibility: 
        - WCAG Contrast: Ensure `text-text-secondary` and `text-foreground` (and any custom `className` colors) 
          meet WCAG AA/AAA contrast ratios against the background.
        - Keyboard Navigation: Standard keyboard navigation (Tab to focus, Enter to activate links) 
          is supported by default due to semantic <nav> and <a> elements. 
          The `focus-visible` styling enhances this.
        - Tooltips: Implemented basic tooltips using the 'title' attribute for truncated items. For more advanced tooltips (e.g., with React Aria), further implementation would be needed.
        Performance: 
        - This component is lightweight. If it's part of a frequently re-rendering parent 
          and profiling shows it as a bottleneck, consider wrapping it with `React.memo`.
        Next.js PPR (Partial Prerendering):
        - If these breadcrumbs are part of a shell/layout that's statically rendered, 
          and the content they link to is dynamic, PPR should work well. 
        - If breadcrumb items are determined client-side based on router events, 
          PPR benefits might be less direct for the breadcrumbs themselves but still apply to the page.
      */}
      <nav
        aria-label={t("breadcrumbNavLabel")} // Use translation key
        // Ensure `text-text-secondary` meets WCAG AA/AAA contrast. Check project's color palette.
        className={cn("text-text-secondary text-sm", className)}
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
                  <Link href={item.href} legacyBehavior>
                    <a
                      className="focus-visible:ring-ring truncate rounded hover:underline focus:outline-none focus-visible:ring-1"
                      title={item.label} // Basic tooltip for truncated text
                    >
                      {item.label}
                    </a>
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className="text-text-body truncate font-medium"
                    title={item.label} // Basic tooltip for truncated text
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export { Breadcrumbs };
