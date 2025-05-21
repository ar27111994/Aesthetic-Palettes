// lib/hooks/usePalettePreview.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { generatePalette } from "@utils/color";
import { PeriodicTaskRunner } from "@utils/periodic-task-runner";
import { ColorSwatch } from "@typings/PaletteState";

export interface PalettePreviewData {
  samplePalette: ColorSwatch[];
  decorators: string[];
}

const generatePalettePreview = (paletteSize: number): PalettePreviewData => {
  const samplePalette: ColorSwatch[] = generatePalette({ paletteSize });
  const decorators = [
    samplePalette[0].value,
    samplePalette[samplePalette.length - 1].value,
  ];
  return { samplePalette, decorators };
};

interface UsePalettePreviewProps {
  paletteSize: number;
  updateDelay: number;
}

export function usePalettePreview({
  paletteSize,
  updateDelay,
}: UsePalettePreviewProps): PalettePreviewData {
  const { samplePalette: initialPalette, decorators: initialDecorators } =
    generatePalettePreview(paletteSize);

  const [palettePreview, setPalettePreview] = useState<PalettePreviewData>({
    samplePalette: initialPalette,
    decorators: initialDecorators,
  });

  const runnerRef = useRef<PeriodicTaskRunner | null>(null);

  const runPaletteUpdate = useCallback(() => {
    const { samplePalette: palette, decorators: paletteDecorators } =
      generatePalettePreview(paletteSize);
    setPalettePreview({
      samplePalette: palette,
      decorators: paletteDecorators,
    });
  }, [paletteSize]);

  useEffect(() => {
    const runner = new PeriodicTaskRunner(runPaletteUpdate, updateDelay);
    runnerRef.current = runner;
    runner.start();

    return () => {
      runnerRef.current?.stop();
      runnerRef.current = null;
    };
  }, [runPaletteUpdate, updateDelay]);

  return palettePreview;
}
