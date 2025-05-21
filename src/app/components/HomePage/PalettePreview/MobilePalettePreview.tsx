// app/components/HomePage/PalettePreview/MobilePalettePreview.tsx
import React from "react";
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
import { generatePalette } from "@utils/color";
import { ColorSwatch } from "@typings/PaletteState";
import { createTranslator } from "next-intl";

// Moved mobilePalettes constant here
const mobilePaletteSize = 5; // Number of colors for the mobile preview
const mobilePalettesData: ColorSwatch[][] = Array.from({ length: 15 }, () =>
  generatePalette({ paletteSize: mobilePaletteSize }),
);

interface MobilePalettePreviewProps {
  tHome: ReturnType<typeof createTranslator>;
  tAccessibility: ReturnType<typeof createTranslator>;
}

export function MobilePalettePreview({
  tHome,
  tAccessibility,
}: MobilePalettePreviewProps) {
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
                  "--delay": `${mobilePalettesData.length}s`, // Adjust the duration based on the number of palettes
                } as React.CSSProperties
              }
            >
              {/* Duplicate the palettes to create a continuous scrolling effect */}
              {/* ---- START: Block 1 of Palettes ---- */}
              <div className="flex flex-col space-y-4 overflow-hidden px-2 sm:px-4">
                {mobilePalettesData.map((palette, index) => (
                  <div
                    key={`palette-block1-${index}`} // Unique key for items in block 1
                    className="border-border-divider box-border flex min-h-7.5 shrink-0 flex-row overflow-hidden rounded-md border-1 shadow-md last:mb-4"
                  >
                    {palette.map((color, colorIndex) => (
                      <div
                        key={colorIndex} // Unique key for each color in the palette
                        className="not-last:border-r-border-divider/15 flex-1 transition-colors duration-500 ease-in-out not-last:border-r-[0.15px] hover:opacity-90 motion-reduce:transition-none"
                        style={{ backgroundColor: color.value }}
                        aria-label={tAccessibility("colorSwatchLabel", {
                          hex: color.value,
                        })}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
              {/* ---- END: Block 1 of Palettes ---- */}
              {/* ---- START: Block 2 of Palettes ---- */}
              <div className="flex flex-col space-y-4 overflow-hidden px-2 sm:px-4">
                {mobilePalettesData.map((palette, index) => (
                  <div
                    key={`palette-block2-${index}`} // Unique key for items in block 2
                    className="border-border-divider box-border flex min-h-7.5 shrink-0 flex-row overflow-hidden rounded-md border-1 shadow-md last:mb-4"
                  >
                    {palette.map((color, colorIndex) => (
                      <div
                        key={colorIndex} // Unique key for each color in the palette
                        className="not-last:border-r-border-divider/15 flex-1 transition-colors duration-500 ease-in-out not-last:border-r-[0.15px] hover:opacity-90 motion-reduce:transition-none"
                        style={{ backgroundColor: color.value }}
                        aria-label={tAccessibility("colorSwatchLabel", {
                          hex: color.value,
                        })}
                      ></div>
                    ))}
                  </div>
                ))}
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
