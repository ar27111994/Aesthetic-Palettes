// app/components/HomePage/PalettePreview/MobilePalettePreview.tsx
import React, { useState, useEffect, useMemo } from "react"; // Added useState, useEffect
import {
  FiBarChart2,
  FiWifi,
  FiClock,
  FiBatteryCharging,
  FiMenu,
  FiUser,
  FiPhone,
  FiMessageSquare,
  FiCamera,
} from "react-icons/fi";
import { Button } from "@components/Button";
import Logo from "@components/Logo";
import { generatePalette, generateColorSwatch } from "@utils/color"; // Added generateColorSwatch
import { ColorSwatch } from "@typings/PaletteState";
import { createTranslator } from "next-intl";

const MOBILE_PALETTE_SIZE = 5; // Number of colors for the mobile preview
const NUMBER_OF_MOBILE_PALETTES = 15; // Number of palette rows

interface MobilePalettePreviewProps {
  tHome: ReturnType<typeof createTranslator>;
  tAccessibility: ReturnType<typeof createTranslator>;
}

// 1. Function to generate FIXED, DETERMINISTIC palettes for initial render
const createFixedMobilePalettes = (): ColorSwatch[][] => {
  const fixedPalettes: ColorSwatch[][] = [];
  const defaultFixedMobileColors = [
    // A predefined list of fallback colors
    "#D3D3D3",
    "#C0C0C0",
    "#A9A9A9",
    "#808080",
    "#696969",
    "#F5F5F5",
    "#E8E8E8",
    "#DCDCDC",
    "#BEBEBE",
    "#A0A0A0",
    "#778899",
    "#708090",
    "#2F4F4F",
    "#556B2F",
    "#8FBC8F",
  ];

  for (let i = 0; i < NUMBER_OF_MOBILE_PALETTES; i++) {
    const row: ColorSwatch[] = [];
    for (let j = 0; j < MOBILE_PALETTE_SIZE; j++) {
      const colorValue =
        defaultFixedMobileColors[
          (i * MOBILE_PALETTE_SIZE + j) % defaultFixedMobileColors.length
        ];
      row.push(generateColorSwatch(colorValue)); // Use generateColorSwatch for consistency if it adds name/id
    }
    fixedPalettes.push(row);
  }
  return fixedPalettes;
};

// 2. Function to generate RANDOM palettes for client-side rendering
const generateRandomMobilePalettes = (): ColorSwatch[][] => {
  return Array.from({ length: NUMBER_OF_MOBILE_PALETTES }, () =>
    generatePalette({ paletteSize: MOBILE_PALETTE_SIZE }),
  );
};

export function MobilePalettePreview({
  tHome,
  tAccessibility,
}: MobilePalettePreviewProps) {
  // 3. useState for palettes, initialized to null for client-side determination
  const [palettesForDisplay, setPalettesForDisplay] = useState<
    ColorSwatch[][] | null
  >(null);

  // 4. useEffect to generate random palettes on client
  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    // Generate the random palettes for client-side display.
    setPalettesForDisplay(generateRandomMobilePalettes());

    // Note: The `animate-scroll-y` CSS animation likely handles the continuous scrolling.
    // If you had a JavaScript-based periodic update for the *content* of these palettes
    // (not just the CSS scroll), you would manage its PeriodicTaskRunner here.
    // Based on your current code, the palettes are generated once for the animation.
  }, []); // Empty dependency array means this runs once on mount.

  // Determine which palettes to display
  // On server or initial client hydration, use fixed palettes.
  // After client mount and useEffect, use client-determined random palettes.
  const fixedPalettesRef = useMemo(createFixedMobilePalettes, []);
  const currentPalettes =
    palettesForDisplay === null ? fixedPalettesRef : palettesForDisplay;

  return (
    // {/* Visual Palette Preview - Mobile */}
    <div className="border-background-dark-1 bg-background-dark-1 flex aspect-[77.6/163] h-full flex-col items-stretch justify-stretch rounded-3xl border-10 shadow-2xl sm:absolute sm:-bottom-12 sm:left-24 sm:max-h-[calc(100%-(--spacing(12)))] sm:min-h-60">
      {/* Top Bar */}
      <div className="text-background-page bg-background-dark-2 flex shrink-0 items-center justify-between rounded-t-[12px] p-2">
        <div className="flex items-center space-x-1">
          <FiBarChart2 aria-hidden="true" />
          <FiWifi aria-hidden="true" />
        </div>
        <div>
          <FiClock aria-hidden="true" />
        </div>
        <div>
          <FiBatteryCharging aria-hidden="true" />
        </div>
      </div>

      {/* Screen */}
      <div className="bg-background-subtle flex h-full flex-col justify-between overflow-hidden">
        {/* App Area */}
        <div className="overflow-hidden">
          {/* Top Bar (Navigation) */}
          <div className="bg-background-page sticky top-0 z-10 flex shrink-0 items-center justify-between shadow-md">
            <Button
              variant="none"
              size="sm"
              className="text-text-heading hover:text-primary-action-hover"
              aria-label={tHome("menuButtonLabel")}
            >
              <FiMenu className="h-5 w-5 text-inherit" aria-hidden="true" />
            </Button>
            <Logo
              className="h-5 w-auto object-cover"
              aria-label={tHome("logoAltText")}
            />
            <Button
              variant="none"
              size="sm"
              className="text-text-heading hover:text-primary-action-hover"
              aria-label={tHome("userProfileButtonLabel")}
            >
              <FiUser className="h-5 w-5 text-inherit" aria-hidden="true" />
            </Button>
          </div>
          {/* Mobile Palette Preview */}
          {/* Scrollable Viewport for Palettes */}
          <div className="flex-grow overflow-hidden">
            <div
              className="animate-scroll-y"
              style={
                {
                  "--delay": `${currentPalettes.length}s`, // Use currentPalettes.length
                } as React.CSSProperties
              }
            >
              {/* Duplicate the palettes to create a continuous scrolling effect */}
              {/* ---- START: Block 1 of Palettes ---- */}
              <div className="flex flex-col space-y-4 overflow-hidden px-2 sm:px-4">
                {currentPalettes.map(
                  (
                    palette,
                    index, // Use currentPalettes
                  ) => (
                    <div
                      key={`palette-block1-${index}`}
                      className="border-border-divider box-border flex min-h-7.5 shrink-0 flex-row overflow-hidden rounded-md border-1 shadow-md last:mb-4"
                    >
                      {palette.map((color, colorIndex) => (
                        <div
                          key={`${color.value}-${colorIndex}`} // Make key more robust if color values can repeat
                          className="not-last:border-r-border-divider/15 flex-1 transition-colors duration-500 ease-in-out not-last:border-r-[0.15px] hover:opacity-90 motion-reduce:transition-none"
                          style={{ backgroundColor: color.value }}
                          aria-label={tAccessibility("colorSwatchLabel", {
                            hex: color.value,
                          })}
                        ></div>
                      ))}
                    </div>
                  ),
                )}
              </div>
              {/* ---- END: Block 1 of Palettes ---- */}
              {/* ---- START: Block 2 of Palettes ---- */}
              <div className="flex flex-col space-y-4 overflow-hidden px-2 sm:px-4">
                {currentPalettes.map(
                  (
                    palette,
                    index, // Use currentPalettes
                  ) => (
                    <div
                      key={`palette-block2-${index}`}
                      className="border-border-divider box-border flex min-h-7.5 shrink-0 flex-row overflow-hidden rounded-md border-1 shadow-md last:mb-4"
                    >
                      {palette.map((color, colorIndex) => (
                        <div
                          key={`${color.value}-${colorIndex}-block2`} // Make key more robust
                          className="not-last:border-r-border-divider/15 flex-1 transition-colors duration-500 ease-in-out not-last:border-r-[0.15px] hover:opacity-90 motion-reduce:transition-none"
                          style={{ backgroundColor: color.value }}
                          aria-label={tAccessibility("colorSwatchLabel", {
                            hex: color.value,
                          })}
                        ></div>
                      ))}
                    </div>
                  ),
                )}
              </div>
              {/* ---- END: Block 2 of Palettes ---- */}
            </div>
          </div>
        </div>

        {/* Bottom Bar (Navigation) */}
        <div className="bg-background-page border-border-divider sticky bottom-0 z-10 flex shrink-0 items-center justify-around border-t shadow-md">
          <Button
            variant="none"
            size="sm"
            className="text-accent hover:text-primary-action-hover"
            aria-label={tHome("phoneButtonLabel")}
          >
            <FiPhone className="text-xl" aria-hidden="true" />
          </Button>
          <Button
            variant="none"
            size="sm"
            className="text-accent hover:text-primary-action-hover"
            aria-label={tHome("messagesButtonLabel")}
          >
            <FiMessageSquare className="text-xl" aria-hidden="true" />
          </Button>
          <Button
            variant="none"
            size="sm"
            className="text-accent hover:text-primary-action-hover"
            aria-label={tHome("cameraButtonLabel")}
          >
            <FiCamera className="text-xl" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="content-center rounded-b-[12px] bg-gray-800 p-2">
        <div className="bg-background-page mx-auto h-1 w-8 rounded-full"></div>
      </div>
    </div>
  );
}
