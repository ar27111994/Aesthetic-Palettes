import { VisionDeficiencyName } from "@utils/vision";

export type Accessibility = "AAA" | "AA" | "Fail";
export type PaletteStatus = "idle" | "loading" | "failed";
export type PaletteLayout = "horizontal" | "vertical";
export type PaletteViewMode = "compact" | "full";
export type PaletteType =
  | "analogous"
  | "monochromatic"
  | "complementary"
  | "triadic"
  | "tetradic"
  | "split-complementary"
  | "square"
  | "rectangle"
  | "circle"
  | "triangle"
  | "pentagon"
  | "hexagon"
  | "heptagon"
  | "octagon"
  | "star"
  | "gradient"
  | "custom";
export const DefaultPaletteSize = 5;
export const MinPaletteSize = 3;
export const MaxPaletteSize = 10;

export interface ColorSwatch {
  value: string;
  contrast: number;
  accessibility: Accessibility;
  textColor?: string;
  visionDeficiency?: Partial<Record<VisionDeficiencyName, string>>;
}

export interface PaletteState {
  viewMode: PaletteViewMode;
  currentPalette: ColorSwatch[];
  lockedIndices: number[];
  layout: PaletteLayout;
  status?: PaletteStatus;
  error?: string;
  past: ColorSwatch[][];
  future: ColorSwatch[][];
}

export const initialState: PaletteState = {
  currentPalette: [],
  lockedIndices: [],
  viewMode: "full",
  layout: "vertical",
  past: [],
  future: [],
};
