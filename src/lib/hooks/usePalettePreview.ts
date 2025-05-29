// lib/hooks/usePalettePreview.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { generateColorSwatch, generatePalette } from "@utils/color";
import { PeriodicTaskRunner } from "@utils/periodic-task-runner";
import { ColorSwatch } from "@typings/PaletteState";

export interface PalettePreviewData {
  samplePalette: ColorSwatch[];
  decorators: string[];
}

// This function generates the RANDOM palette using the non-deterministic `generatePalette`.
const generateRandomPalettePreview = (
  paletteSize: number,
): PalettePreviewData => {
  const samplePalette: ColorSwatch[] = generatePalette({ paletteSize });

  let decoratorColor1 = "#000000"; // Default fallback for decorator 1
  let decoratorColor2 = "#FFFFFF"; // Default fallback for decorator 2

  if (samplePalette.length > 0) {
    decoratorColor1 = samplePalette[0].value;
    // Use the last color for the second decorator; if only one color, use it for both
    decoratorColor2 = samplePalette[samplePalette.length - 1].value;
  }

  return { samplePalette, decorators: [decoratorColor1, decoratorColor2] };
};

// This function generates a FIXED, DETERMINISTIC palette for initial server and client render.
// This ensures that server-rendered HTML and client's first render attempt match.
const createFixedInitialPalettePreview = (
  paletteSize: number,
): PalettePreviewData => {
  const defaultFixedColors = [
    // A predefined list of fallback colors
    "#f8f9fa",
    "#e9ecef",
    "#dee2e6",
    "#ced4da",
    "#adb5bd",
    "#6c757d",
    "#495057",
    "#343a40",
    "#212529",
  ];

  const samplePalette: ColorSwatch[] = [];
  for (let i = 0; i < paletteSize; i++) {
    samplePalette.push(
      generateColorSwatch(defaultFixedColors[i % defaultFixedColors.length]),
    ); // Cycle through fixed colors
  }

  let decoratorColor1 = defaultFixedColors[0];
  // Ensure there's a fallback for decoratorColor2 if defaultFixedColors is very short
  let decoratorColor2 = defaultFixedColors[1] || defaultFixedColors[0];

  if (samplePalette.length > 0) {
    decoratorColor1 = samplePalette[0].value;
    decoratorColor2 = samplePalette[samplePalette.length - 1].value;
  }

  return { samplePalette, decorators: [decoratorColor1, decoratorColor2] };
};

interface UsePalettePreviewProps {
  paletteSize: number;
  updateDelay: number;
}

export function usePalettePreview({
  paletteSize,
  updateDelay,
}: UsePalettePreviewProps): PalettePreviewData {
  // State to hold the palette data. Initialized to null to signify that
  // client-specific (potentially random) data hasn't been generated yet.
  const [clientDeterminedPalette, setClientDeterminedPalette] =
    useState<PalettePreviewData | null>(null);
  const runnerRef = useRef<PeriodicTaskRunner | null>(null);
  const runPaletteUpdate = useCallback(() => {
    // `paletteSize` is captured from the hook's arguments.
    // `setClientDeterminedPalette` is stable and doesn't need to be in useCallback's dependencies.
    setClientDeterminedPalette(generateRandomPalettePreview(paletteSize));
  }, [paletteSize]); // Dependency: paletteSize, because generateRandomPalettePreview uses it

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.

    // Generate the first "random" palette for client-side display.
    // This will update the state and trigger a re-render with the random colors.
    const firstClientPalette = generateRandomPalettePreview(paletteSize);
    setClientDeterminedPalette(firstClientPalette);

    // Set up the periodic task runner to continue updating the palette
    const runner = new PeriodicTaskRunner(runPaletteUpdate, updateDelay);
    runnerRef.current = runner;
    runner.start();

    // Cleanup function: stop the runner when the component unmounts or dependencies change.
    return () => {
      runnerRef.current?.stop();
      runnerRef.current = null; // Important to clear the ref for cleanup
    };
  }, [paletteSize, updateDelay]); // Re-run this effect if paletteSize or updateDelay props change.

  // Logic to determine which palette data to return:
  if (clientDeterminedPalette === null) {
    // If clientDeterminedPalette is still null, it means:
    // 1. We are rendering on the server.
    // 2. We are on the client, but the useEffect hook hasn't run yet (i.e., during the initial hydration render).
    // In both these cases, return the fixed, deterministic palette to ensure consistency.
    return createFixedInitialPalettePreview(paletteSize);
  } else {
    // If clientDeterminedPalette has a value, it means useEffect has run on the client.
    // Return the client-determined (random) palette.
    return clientDeterminedPalette;
  }
}
