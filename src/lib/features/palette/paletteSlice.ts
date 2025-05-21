import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@lib/store";
import {
  ColorSwatch as ColorSwatchType,
  DefaultPaletteSize,
  initialState,
  MaxPaletteSize,
  MinPaletteSize,
  PaletteState,
} from "@typings/PaletteState";
import { generatePalette } from "@utils/color";
import { createAppSlice } from "@lib/createAppSlice";

export const generateNewPalette = createAsyncThunk<
  ColorSwatchType[],
  void,
  { state: RootState }
>("palette/generateNewPalette", async (_, { getState }) => {
  const { lockedIndices, currentPalette } = getState().palette as PaletteState;
  const paletteSize = currentPalette.length || DefaultPaletteSize;
  return generatePalette({ paletteSize, lockedIndices, currentPalette });
});

const paletteSlice = createAppSlice({
  name: "palette",
  initialState,
  reducers: {
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === "compact" ? "full" : "compact";
    },
    toggleLayout: (state) => {
      state.layout = state.layout === "horizontal" ? "vertical" : "horizontal";
    },
    undo: (state) => {
      if (state.past.length > 0) {
        const previous = state.past[state.past.length - 1];
        state.future = [state.currentPalette, ...state.future];
        state.currentPalette = previous;
        state.past = state.past.slice(0, -1);
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future[0];
        state.past = [...state.past, state.currentPalette];
        state.currentPalette = next;
        state.future = state.future.slice(1);
      }
    },
    setPaletteSize: (state, action: PayloadAction<number>) => {
      const newSize = action.payload;
      if (newSize < MinPaletteSize || newSize > MaxPaletteSize) return; // Prevent invalid sizes

      const currentSize = state.currentPalette.length;

      if (newSize > currentSize) {
        // Add new unlocked colors
        const newColors = generatePalette({
          paletteSize: newSize - currentSize,
          startColor: state.currentPalette[0].value,
        });
        state.currentPalette = [...state.currentPalette, ...newColors];
      } else if (newSize < currentSize) {
        // Remove colors beyond new size, preserving locked indices
        const preservedIndices = state.lockedIndices;

        const lockedPalette = state.currentPalette
          .slice(
            0,
            newSize > preservedIndices.length
              ? newSize
              : preservedIndices.length,
          )
          .map((color, index) =>
            preservedIndices.includes(index) ? color : ({} as ColorSwatchType),
          );

        let newPalette = lockedPalette.filter((color) => !color.value);
        if (newPalette.length) {
          newPalette = generatePalette({
            paletteSize: newPalette.length,
            startColor: newPalette[0].value,
            endColor: newPalette[newPalette.length - 1].value,
          });

          state.currentPalette = lockedPalette.map((color) => {
            if (!color.value) {
              return newPalette.shift() as ColorSwatchType;
            }
            return color;
          });
        }

        state.lockedIndices = preservedIndices;
      }

      // Save previous state for undo
      state.past = [...state.past, state.currentPalette];
    },
    setPalette: (state, action: PayloadAction<ColorSwatchType[]>) => {
      state.currentPalette = action.payload;
      // Reset locked indices when setting a new palette?
      // state.lockedIndices = [];

      // Save previous state for undo
      state.past = [...state.past, state.currentPalette];
    },
    toggleLock: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.currentPalette.findIndex(
        (swatch) => swatch.value === id,
      );
      if (index === -1) return; // Color not found

      if (state.lockedIndices.includes(index)) {
        state.lockedIndices = state.lockedIndices.filter((i) => i !== index);
      } else {
        state.lockedIndices.push(index);
        state.lockedIndices.sort((a, b) => a - b); // Keep sorted
      }

      // Save previous state for undo
      state.past = [...state.past, state.currentPalette];
    },
    deleteColor: (state, action: PayloadAction<string>) => {
      const idToDelete = action.payload;
      const indexToDelete = state.currentPalette.findIndex(
        (swatch) => swatch.value === idToDelete,
      );

      if (indexToDelete === -1) return; // Color not found

      if (state.currentPalette.length > MinPaletteSize) {
        // Prevent deleting below minSize colors
        state.currentPalette.splice(indexToDelete, 1);
        // Adjust locked indices after deletion
        state.lockedIndices = state.lockedIndices
          .map((lockedIndex) => {
            if (lockedIndex > indexToDelete) {
              return lockedIndex - 1;
            }
            return lockedIndex;
          })
          .filter((lockedIndex) => lockedIndex !== indexToDelete); // Ensure deleted index is removed if locked
      }

      // Save previous state for undo
      state.past = [...state.past, state.currentPalette];
    },
    reorderPalette: (
      state,
      action: PayloadAction<{ oldIndex: number; newIndex: number }>,
    ) => {
      const { oldIndex, newIndex } = action.payload;
      if (oldIndex === newIndex) return; // No change

      const palette = state.currentPalette;
      const [movedItem] = palette.splice(oldIndex, 1);
      palette.splice(newIndex, 0, movedItem);

      // Update locked indices based on the reorder
      // Note: dragIndex becomes oldIndex, hoverIndex becomes newIndex
      const dragIndex = oldIndex;
      const hoverIndex = newIndex;

      // Update locked indices based on the reorder
      const newLockedIndices: number[] = [];
      state.lockedIndices.forEach((oldLockedIndex) => {
        if (oldLockedIndex === dragIndex) {
          // The dragged item keeps its locked state at the new position
          newLockedIndices.push(hoverIndex);
        } else if (dragIndex < hoverIndex) {
          // Item moved down
          if (oldLockedIndex > dragIndex && oldLockedIndex <= hoverIndex) {
            // Items between old and new position shift up
            newLockedIndices.push(oldLockedIndex - 1);
          } else {
            newLockedIndices.push(oldLockedIndex);
          }
        } else {
          // dragIndex > hoverIndex
          // Item moved up
          if (oldLockedIndex >= hoverIndex && oldLockedIndex < dragIndex) {
            // Items between new and old position shift down
            newLockedIndices.push(oldLockedIndex + 1);
          } else {
            newLockedIndices.push(oldLockedIndex);
          }
        }
      });
      state.lockedIndices = newLockedIndices.sort((a, b) => a - b); // Keep sorted

      // Save previous state for undo
      state.past = [...state.past, state.currentPalette];
    },
    // Add other reducers like addColor, updateColor, setPaletteSize etc.
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateNewPalette.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        generateNewPalette.fulfilled,
        (state, action: PayloadAction<ColorSwatchType[]>) => {
          state.status = "idle";
          state.past = [...state.past, state.currentPalette];
          state.currentPalette = action.payload;
          state.future = [];
        },
      )
      .addCase(generateNewPalette.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to generate palette";
      });
  },
});

export const {
  setPalette,
  toggleLock,
  deleteColor,
  reorderPalette,
  undo,
  redo,
  setPaletteSize,
  toggleLayout,
  toggleViewMode,
} = paletteSlice.actions;

export default paletteSlice.reducer;
