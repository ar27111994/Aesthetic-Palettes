import chroma from "chroma-js";

// --- Vision Deficiency Simulation ---
export type VisionDeficiencyName =
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "achromatopsia"
  | "protanomaly"
  | "deuteranomaly"
  | "tritanomaly"
  | "monochromacy"
  | "achromatomaly";
export const VISION_DEFICIENCY_TYPES: VisionDeficiencyName[] = [
  "protanopia",
  "deuteranopia",
  "tritanopia",
  "achromatopsia",
  "protanomaly",
  "deuteranomaly",
  "tritanomaly",
  "monochromacy",
  "achromatomaly",
];

// Color transformation matrices for different vision deficiencies
// These matrices are based on established models for color vision deficiency simulation
const VISION_DEFICIENCY_MATRICES = {
  // Complete red blindness
  protanopia: [
    [0.567, 0.433, 0.0],
    [0.558, 0.442, 0.0],
    [0.0, 0.242, 0.758],
  ],
  // Complete green blindness
  deuteranopia: [
    [0.625, 0.375, 0.0],
    [0.7, 0.3, 0.0],
    [0.0, 0.3, 0.7],
  ],
  // Complete blue blindness
  tritanopia: [
    [0.95, 0.05, 0.0],
    [0.0, 0.433, 0.567],
    [0.0, 0.475, 0.525],
  ],
  // Complete color blindness (monochromacy)
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
  // Partial red blindness
  protanomaly: [
    [0.817, 0.183, 0.0],
    [0.333, 0.667, 0.0],
    [0.0, 0.125, 0.875],
  ],
  // Partial green blindness
  deuteranomaly: [
    [0.8, 0.2, 0.0],
    [0.258, 0.742, 0.0],
    [0.0, 0.142, 0.858],
  ],
  // Partial blue blindness
  tritanomaly: [
    [0.967, 0.033, 0.0],
    [0.0, 0.733, 0.267],
    [0.0, 0.183, 0.817],
  ],
  // Same as achromatopsia (complete monochromacy)
  monochromacy: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
  // Partial monochromacy
  achromatomaly: [
    [0.618, 0.32, 0.062],
    [0.163, 0.775, 0.062],
    [0.163, 0.32, 0.516],
  ],
};

/**
 * Transforms RGB values based on a color vision deficiency matrix
 *
 * @param rgb Array of RGB values [r, g, b] in range 0-255
 * @param matrix Transformation matrix for the color vision deficiency
 * @returns Transformed RGB values [r, g, b] in range 0-255
 */
function applyDeficiencyMatrix(
  rgb: number[],
  matrix: number[][],
): [number, number, number] {
  // Normalize RGB values to range 0-1
  const normalizedRGB = rgb.map((value) => value / 255);

  // Apply transformation matrix
  const result = [
    normalizedRGB[0] * matrix[0][0] +
      normalizedRGB[1] * matrix[0][1] +
      normalizedRGB[2] * matrix[0][2],
    normalizedRGB[0] * matrix[1][0] +
      normalizedRGB[1] * matrix[1][1] +
      normalizedRGB[2] * matrix[1][2],
    normalizedRGB[0] * matrix[2][0] +
      normalizedRGB[1] * matrix[2][1] +
      normalizedRGB[2] * matrix[2][2],
  ];

  // Convert back to range 0-255 and ensure values are within bounds
  return result.map((value) =>
    Math.max(0, Math.min(255, Math.round(value * 255))),
  ) as [number, number, number];
}

/**
 * Simulates how a color would appear to someone with a specific color vision deficiency
 *
 * @param hex Hex color code (e.g., "#FF5500")
 * @param deficiencyType Type of color vision deficiency to simulate
 * @returns Hex color code representing how the original color would appear
 */
export function simulateColorBlindness(
  hex: string,
  deficiencyType: VisionDeficiencyName,
): string {
  try {
    // Parse the hex color to get RGB values
    const color = chroma(hex);
    const rgb = color.rgb();

    // Get the appropriate transformation matrix
    const matrix = VISION_DEFICIENCY_MATRICES[deficiencyType];
    if (!matrix) {
      console.warn(`Unknown deficiency type: ${deficiencyType}`);
      return hex;
    }

    // Apply the transformation matrix to simulate the color vision deficiency
    const transformedRGB = applyDeficiencyMatrix(rgb, matrix);

    // Convert back to hex color code
    return chroma(transformedRGB).hex();
  } catch (e) {
    console.warn(`Could not simulate ${deficiencyType} for ${hex}`, e);
    return hex;
  }
}
