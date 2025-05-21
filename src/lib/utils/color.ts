import {
  Accessibility as AccessibilityLevel,
  ColorSwatch as ColorSwatchType,
  PaletteType,
} from "@typings/PaletteState";
import chroma from "chroma-js";
import {
  VisionDeficiencyName,
  VISION_DEFICIENCY_TYPES,
  simulateColorBlindness,
} from "@utils/vision";

// --- Constants ---
const HUE_STEP_TRIADIC = 120;
const HUE_STEP_SQUARE = 90;
const HUE_SPLIT_COMPLEMENTARY_OFFSET = 30;
const HUE_TETRADIC_OFFSETS = [0, 60, 180, 240];
const HUE_RECTANGLE_OFFSETS = HUE_TETRADIC_OFFSETS;

const DEFAULT_ANALOGOUS_HUE_RANGE = 60;

const MIN_CONTRAST_AA = 4.5;
const MIN_CONTRAST_AAA = 7;

// For Monochromatic palette's lightness range (L in LCH)
const MONOCHROMATIC_LCH_LIGHTNESS_MIN = 10;
const MONOCHROMATIC_LCH_LIGHTNESS_MAX = 90;

// --- Types for Palette Generation ---
export interface PaletteGeneratorParams {
  paletteSize: number;
  startColorHex: string;
  endColorHex?: string;
  currentHexPalette?: string[];
}

type PaletteGeneratorFn = (params: PaletteGeneratorParams) => string[];

interface PaletteGeneratorMap {
  [key: string]: PaletteGeneratorFn;
}

// --- Core Helper: Generate Color Swatch ---
export const generateColorSwatch = (hex?: string): ColorSwatchType => {
  const colorHex = hex || chroma.random().hex();
  const chColor = chroma(colorHex);

  const contrastWhite = chroma.contrast(chColor, "white");
  const contrastBlack = chroma.contrast(chColor, "black");
  const bestTextColor = contrastWhite >= contrastBlack ? "#FFFFFF" : "#000000";

  const wcagContrastWithBestText = chroma.contrast(chColor, bestTextColor);

  let accessibility: AccessibilityLevel = "Fail";
  if (wcagContrastWithBestText >= MIN_CONTRAST_AAA) {
    accessibility = "AAA";
  } else if (wcagContrastWithBestText >= MIN_CONTRAST_AA) {
    accessibility = "AA";
  }

  const visionDeficiencies: Partial<Record<VisionDeficiencyName, string>> = {};
  VISION_DEFICIENCY_TYPES.forEach((type) => {
    visionDeficiencies[type] = simulateColorBlindness(colorHex, type);
  });

  return {
    value: colorHex,
    textColor: bestTextColor,
    contrast: wcagContrastWithBestText,
    accessibility: accessibility,
    visionDeficiency: visionDeficiencies,
  };
};

// --- Core Helper: Invert Color (RGB based) ---
export const invertColor = (hex: string): string => {
  try {
    const rgb = chroma(hex).rgb();
    const invertedRgb = rgb.map((value) => 255 - value) as [
      number,
      number,
      number,
    ];
    return chroma(invertedRgb).hex();
  } catch (error) {
    console.warn(`Failed to invert color ${hex}:`, error);
    return hex;
  }
};

// --- Core Helper: Get Complementary Color (LCH Hue based) ---
function _getComplementaryColor(colorHex: string): string {
  try {
    const originalColor = chroma(colorHex);
    const originalHueLCH = originalColor.get("lch.h");

    if (isNaN(originalHueLCH)) {
      const l = originalColor.get("lch.l");
      return originalColor.set("lch.l", 100 - l).hex();
    }

    const complementaryHueLCH = (originalHueLCH + 180) % 360;
    return originalColor.set("lch.h", complementaryHueLCH).hex();
  } catch (error) {
    console.warn(`Failed to get complementary for ${colorHex}:`, error);
    return chroma.random().hex();
  }
}

// --- Palette Generation Helpers ---
function _distributeKeyColors(
  paletteSize: number,
  keyColorHexes: string[],
): string[] {
  if (paletteSize <= 0) return [];
  if (keyColorHexes.length === 0) {
    return Array.from({ length: paletteSize }, () => chroma.random().hex());
  }
  if (paletteSize === 1) return [keyColorHexes[0]];
  if (paletteSize <= keyColorHexes.length) {
    return keyColorHexes.slice(0, paletteSize);
  }
  return chroma.scale(keyColorHexes).mode("lch").colors(paletteSize);
}

function _generatePaletteFromHueOffsets(
  paletteSize: number,
  startColorHex: string,
  hueOffsets: number[],
): string[] {
  const baseColor = chroma(startColorHex);
  const baseHue = baseColor.get("hsl.h");

  const keyColors = hueOffsets.map((offset) => {
    if (isNaN(baseHue)) return baseColor;
    return baseColor.set("hsl.h", (baseHue + offset + 360) % 360);
  });

  return _distributeKeyColors(
    paletteSize,
    keyColors.map((c) => c.hex()),
  );
}

function _generateNgonKeyColors(
  startColorHex: string,
  numSides: number,
): chroma.Color[] {
  if (numSides <= 0) numSides = 1;
  const baseColor = chroma(startColorHex);
  const baseHue = baseColor.get("hsl.h");
  const keyColors: chroma.Color[] = [];
  const baseLightness = baseColor.get("lch.l");

  for (let i = 0; i < numSides; i++) {
    if (isNaN(baseHue)) {
      const lShift = numSides > 1 ? (i / (numSides - 1) - 0.5) * 30 : 0;
      keyColors.push(
        baseColor.set(
          "lch.l",
          Math.max(0, Math.min(100, baseLightness + lShift)),
        ),
      );
    } else {
      const newHue = (baseHue + i * (360 / numSides) + 360) % 360;
      keyColors.push(baseColor.set("hsl.h", newHue));
    }
  }
  return keyColors;
}

// --- Specific Palette Generation Logics ---
function generateAnalogousPalette({
  paletteSize,
  startColorHex,
}: PaletteGeneratorParams): string[] {
  if (paletteSize <= 0) return [];
  const baseColor = chroma(startColorHex);
  const baseHue = baseColor.get("hsl.h");
  const colors: string[] = [];
  const baseLightness = baseColor.get("lch.l");
  const hueStep =
    paletteSize > 1 ? DEFAULT_ANALOGOUS_HUE_RANGE / (paletteSize - 1) : 0;

  for (let i = 0; i < paletteSize; i++) {
    if (isNaN(baseHue)) {
      const lShift = paletteSize > 1 ? (i / (paletteSize - 1) - 0.5) * 30 : 0;
      colors.push(
        baseColor
          .set("lch.l", Math.max(0, Math.min(100, baseLightness + lShift)))
          .hex(),
      );
    } else {
      const newHue =
        (baseHue - DEFAULT_ANALOGOUS_HUE_RANGE / 2 + i * hueStep + 360) % 360;
      colors.push(baseColor.set("hsl.h", newHue).hex());
    }
  }
  return colors;
}

function generateMonochromaticPalette({
  paletteSize,
  startColorHex,
}: PaletteGeneratorParams): string[] {
  if (paletteSize <= 0) return [];
  if (paletteSize === 1) return [startColorHex];

  const baseColor = chroma(startColorHex);

  // Create a scale using the hue and chroma of the startColor,
  // but varying LCH lightness over a defined range.
  const colorAtMinLightness = baseColor.set(
    "lch.l",
    MONOCHROMATIC_LCH_LIGHTNESS_MIN,
  );
  const colorAtMaxLightness = baseColor.set(
    "lch.l",
    MONOCHROMATIC_LCH_LIGHTNESS_MAX,
  );

  // If the original color's lightness is outside this range,
  // we might want to adjust the scale, or ensure the original color is included.
  // For simplicity, we create a scale between a dark and light version of the input color's hue/chroma.
  // A more sophisticated approach might try to center the scale around the original color's lightness
  // or ensure it's one of the generated colors.
  // The current approach creates a perceptually smooth monochromatic ramp from dark to light.

  // Let's try to make the scale go from dark to light version of the *original color itself*
  // by keeping the original color as one of the points if desired, or by scaling around it.
  // A simple, robust way:
  const darkPoint = baseColor.darken(2); // Can be adjusted
  const lightPoint = baseColor.brighten(2); // Can be adjusted

  // If paletteSize is 3, it will be [darkPoint, baseColor, lightPoint]
  // If paletteSize is 2, it will be [darkPoint, lightPoint] (baseColor might not be exactly in middle)
  // If paletteSize is 5, it interpolates between them.
  // Let's make a scale that includes the base color for better results:
  if (paletteSize === 2) {
    return chroma
      .scale([darkPoint, lightPoint])
      .mode("lch")
      .colors(paletteSize);
  }
  // For paletteSize >= 3, ensure the baseColor is in the middle if possible.
  // This is a common expectation for monochromatic palettes.
  // However, a simple scale from a fixed dark to a fixed light of the same hue is also valid.
  // The original code did this with HSL:
  // DEFAULT_MONOCHROMATIC_LIGHTNESS_START = 0.15 (HSL)
  // DEFAULT_MONOCHROMATIC_LIGHTNESS_END = 0.85 (HSL)
  // This can be translated to LCH:
  const lchColors = chroma
    .scale([
      baseColor.set("lch.l", MONOCHROMATIC_LCH_LIGHTNESS_MIN), // Keep hue and chroma, set L
      baseColor.set("lch.l", MONOCHROMATIC_LCH_LIGHTNESS_MAX), // Keep hue and chroma, set L
    ])
    .mode("lch")
    .colors(paletteSize);

  return lchColors;
}

function generateComplementaryPalette({
  paletteSize,
  startColorHex,
  endColorHex,
}: PaletteGeneratorParams): string[] {
  if (paletteSize <= 0) return [];
  const baseHex = startColorHex;
  const complementHex = endColorHex || _getComplementaryColor(startColorHex);
  if (paletteSize === 1) return [baseHex];
  return chroma.scale([baseHex, complementHex]).mode("lch").colors(paletteSize);
}

function generateSplitComplementaryPalette({
  paletteSize,
  startColorHex,
}: PaletteGeneratorParams): string[] {
  const baseColor = chroma(startColorHex);
  const baseHue = baseColor.get("hsl.h");
  const baseLightness = baseColor.get("lch.l");
  let keyColorsChroma: chroma.Color[];

  if (isNaN(baseHue)) {
    keyColorsChroma = [
      baseColor,
      baseColor.set("lch.l", Math.max(0, baseLightness - 15)),
      baseColor.set("lch.l", Math.min(100, baseLightness + 15)),
    ];
  } else {
    const complementHue = (baseHue + 180 + 360) % 360;
    const hue2 = (complementHue - HUE_SPLIT_COMPLEMENTARY_OFFSET + 360) % 360;
    const hue3 = (complementHue + HUE_SPLIT_COMPLEMENTARY_OFFSET + 360) % 360;
    keyColorsChroma = [
      baseColor,
      baseColor.set("hsl.h", hue2),
      baseColor.set("hsl.h", hue3),
    ];
  }
  return _distributeKeyColors(
    paletteSize,
    keyColorsChroma.map((c) => c.hex()),
  );
}

function generateCirclePalette({
  paletteSize,
  startColorHex,
}: PaletteGeneratorParams): string[] {
  if (paletteSize <= 0) return [];
  const keyColors = _generateNgonKeyColors(startColorHex, paletteSize);
  return keyColors.map((c) => c.hex());
}

function generateStarPalette({
  paletteSize,
  startColorHex,
}: PaletteGeneratorParams): string[] {
  if (paletteSize <= 0) return [];
  const baseColor = chroma(startColorHex);
  const baseHue = baseColor.get("hsl.h");
  const baseLightness = baseColor.get("lch.l");
  const colors: string[] = [];

  for (let i = 0; i < paletteSize; i++) {
    const isComplementAlternate = i % 2 === 1;
    let newColor: chroma.Color;

    if (isNaN(baseHue)) {
      const lVariation =
        paletteSize > 1 ? (i / (paletteSize - 1) - 0.5) * 40 : 0;
      const newLightness =
        baseLightness + (isComplementAlternate ? -lVariation : lVariation);
      newColor = baseColor.set(
        "lch.l",
        Math.max(0, Math.min(100, newLightness)),
      );
    } else {
      let newHue: number;
      if (isComplementAlternate) {
        newHue = (baseHue + 180 + 360) % 360;
      } else {
        newHue = (baseHue + (i / 2) * 20 + 360) % 360;
      }
      newColor = baseColor.set("hsl.h", newHue);
      newColor = newColor.set(
        "hsl.l",
        newColor.get("hsl.l") * (isComplementAlternate ? 0.85 : 1.05),
      );
      newColor = newColor.saturate(isComplementAlternate ? 0.2 : -0.1);
    }
    colors.push(newColor.hex());
  }
  return colors;
}

function generateCustomPalette({
  paletteSize,
  startColorHex,
  currentHexPalette = [],
}: PaletteGeneratorParams): string[] {
  if (paletteSize <= 0) return [];

  if (currentHexPalette.length > 0) {
    if (currentHexPalette.length >= paletteSize) {
      return currentHexPalette.slice(0, paletteSize);
    }
    const additionalColorsNeeded = paletteSize - currentHexPalette.length;
    const lastColor =
      currentHexPalette[currentHexPalette.length - 1] || startColorHex;
    const additionalColors = Array.from(
      { length: additionalColorsNeeded },
      (_, i) =>
        chroma(lastColor)
          .set("hsl.h", `+${(i + 1) * 15}`)
          .darken(i * 0.1)
          .saturate(0.1)
          .hex(),
    );
    return [...currentHexPalette, ...additionalColors];
  }
  const endCustomColor = chroma(_getComplementaryColor(startColorHex))
    .brighten(1)
    .hex();
  return chroma
    .scale([startColorHex, endCustomColor])
    .mode("lch")
    .colors(paletteSize);
}

function generateGradientPalette({
  paletteSize,
  startColorHex,
  endColorHex,
}: PaletteGeneratorParams): string[] {
  if (paletteSize <= 0) return [];
  const effectiveEndColor =
    endColorHex || _getComplementaryColor(startColorHex);
  return chroma
    .scale([startColorHex, effectiveEndColor])
    .mode("lch")
    .colors(paletteSize);
}

const _createNgonPaletteGenerator = (numSides: number): PaletteGeneratorFn => {
  return ({ paletteSize, startColorHex }: PaletteGeneratorParams): string[] =>
    _distributeKeyColors(
      paletteSize,
      _generateNgonKeyColors(startColorHex, numSides).map((c) => c.hex()),
    );
};

// --- Palette Type to Generator Mapping ---
const paletteGenerators: PaletteGeneratorMap = {
  analogous: generateAnalogousPalette,
  monochromatic: generateMonochromaticPalette,
  complementary: generateComplementaryPalette,
  triadic: ({ paletteSize, startColorHex }) =>
    _generatePaletteFromHueOffsets(paletteSize, startColorHex, [
      0,
      HUE_STEP_TRIADIC,
      HUE_STEP_TRIADIC * 2,
    ]),
  tetradic: ({ paletteSize, startColorHex }) =>
    _generatePaletteFromHueOffsets(
      paletteSize,
      startColorHex,
      HUE_TETRADIC_OFFSETS,
    ),
  "split-complementary": generateSplitComplementaryPalette,
  square: ({ paletteSize, startColorHex }) =>
    _generatePaletteFromHueOffsets(paletteSize, startColorHex, [
      0,
      HUE_STEP_SQUARE,
      HUE_STEP_SQUARE * 2,
      HUE_STEP_SQUARE * 3,
    ]),
  rectangle: ({ paletteSize, startColorHex }) =>
    _generatePaletteFromHueOffsets(
      paletteSize,
      startColorHex,
      HUE_RECTANGLE_OFFSETS,
    ),
  circle: generateCirclePalette,
  triangle: (
    { paletteSize, startColorHex }, // Alias for triadic (3-gon)
  ) =>
    _generatePaletteFromHueOffsets(paletteSize, startColorHex, [
      0,
      HUE_STEP_TRIADIC,
      HUE_STEP_TRIADIC * 2,
    ]),
  pentagon: _createNgonPaletteGenerator(5),
  hexagon: _createNgonPaletteGenerator(6),
  heptagon: _createNgonPaletteGenerator(7),
  octagon: _createNgonPaletteGenerator(8),
  star: generateStarPalette,
  gradient: generateGradientPalette,
  custom: generateCustomPalette,
};

// --- Main Palette Generation Function ---
export interface GeneratePaletteOptions {
  paletteSize: number;
  lockedIndices?: number[];
  currentPalette?: ColorSwatchType[];
  startColor?: string;
  endColor?: string;
  paletteType?: PaletteType;
}

export const generatePalette = (
  options: GeneratePaletteOptions,
): ColorSwatchType[] => {
  const {
    paletteSize,
    lockedIndices = [],
    currentPalette,
    startColor: optionStartColor,
    endColor: optionEndColor,
    paletteType = "custom", // Default to custom. Assumes "custom" is a valid PaletteType.
  } = options;

  if (paletteSize <= 0) return [];

  const pStartColor = optionStartColor || chroma.random().hex();

  const generatorFn = paletteGenerators[paletteType];
  let rawHexColors: string[];

  const generatorParams: PaletteGeneratorParams = {
    paletteSize,
    startColorHex: pStartColor,
    endColorHex: optionEndColor,
    currentHexPalette: currentPalette?.map((swatch) => swatch.value),
  };

  if (generatorFn) {
    rawHexColors = generatorFn(generatorParams);
  } else {
    // Fallback to custom if generator is not found
    console.warn(`Unknown palette type: "${paletteType}".`);
    rawHexColors = generateCustomPalette(generatorParams);
  }

  if (!rawHexColors || rawHexColors.length !== paletteSize) {
    console.warn(
      `Generator for type "${paletteType}" returned ${rawHexColors?.length || 0} colors, expected ${paletteSize}. Adjusting.`,
    );
    const tempColors = Array.from({ length: paletteSize });
    for (let i = 0; i < paletteSize; i++) {
      tempColors[i] = rawHexColors?.[i] || chroma.random().hex();
    }
    rawHexColors = tempColors as string[];
  }

  const finalPalette: ColorSwatchType[] = [];
  for (let i = 0; i < paletteSize; i++) {
    const isLocked = lockedIndices.includes(i);
    const lockedSwatch = currentPalette?.[i];

    if (isLocked && lockedSwatch) {
      finalPalette.push(lockedSwatch);
    } else {
      const hex = rawHexColors[i];
      finalPalette.push(generateColorSwatch(hex));
    }
  }
  return finalPalette;
};

// --- Developer Note: Testing ---
// It is highly recommended to implement comprehensive unit tests for:
// - Each individual palette generator function (e.g., generateMonochromaticPalette)
//   - Test with various paletteSizes (0, 1, typical values).
//   - Test with chromatic and achromatic (grayscale) startColorHex values.
//   - Test with endColorHex where applicable.
// - The main `generatePalette` function:
//   - Test different paletteTypes.
//   - Test with and without lockedIndices.
//   - Test with and without currentPalette.
//   - Test edge cases like empty options or invalid paletteSize.
// - Helper functions like `_getComplementaryColor`, `invertColor`, `generateColorSwatch`.
//
// Mocking `chroma.random()` can be useful for predictable test outcomes.
