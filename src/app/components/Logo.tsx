import { useTranslations } from "next-intl";
import React, { SVGProps } from "react";

const Logo: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  const t = useTranslations("Common"); // Initialize translations for Common namespace

  return (
    <svg
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      {...props}
    >
      <title>{t("logoTitle")}</title>
      <desc>{t("logoDescription")}</desc>

      <defs>
        <linearGradient
          id="harmonicGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop
            offset="0%"
            stopColor="var(--color-brand-accent-1)"
            stopOpacity="1"
          />
          <stop
            offset="50%"
            stopColor="var(--color-brand-accent-2)"
            stopOpacity="1"
          />
          <stop
            offset="100%"
            stopColor="var(--color-brand-accent-3)"
            stopOpacity="1"
          />
        </linearGradient>
      </defs>

      <g transform="translate(5, 12) rotate(-10 35 35)">
        {/* Base rectangle slightly larger to give depth illusion */}
        {/* Slightly rounded corners */}
        {/* Dark stroke for definition, can be adjusted or removed */}
        <rect
          y="45"
          width="70"
          height="18"
          rx="3"
          ry="3"
          className="fill-disabled-bg stroke-text-body-stronger stroke-1"
          transform="rotate(5 45 54)"
        />
        <rect
          y="30"
          width="70"
          height="18"
          rx="3"
          ry="3"
          className="fill-border-strong stroke-text-body-stronger stroke-1"
          transform="rotate(0 45 39)"
        />
        <rect
          y="15"
          width="70"
          height="18"
          rx="3"
          ry="3"
          className="stroke-text-body-stronger fill-[url(#harmonicGradient)] stroke-1"
          transform="rotate(-5 45 24)"
        />
        <rect
          y="0"
          width="70"
          height="18"
          rx="3"
          ry="3"
          className="fill-background-page stroke-text-body-stronger stroke-1"
          transform="rotate(-10 45 9)"
          filter="url(#dropShadow)"
        />
      </g>

      {/* Add a subtle shadow for the top element */}
      <defs>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
          <feOffset dx="1" dy="2" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

export default Logo;
