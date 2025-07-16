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
import { WritableDraft } from "immer";

// A simple unique ID generator
const generateUniqueId = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

function extractCurrentPalette(
  state: WritableDraft<PaletteState>,
): WritableDraft<PaletteState> {
  const { past, future, ...rest } = state;
  return rest as WritableDraft<PaletteState>;
}

const withHistory = <T extends PayloadAction<any>>(
  reducer: (state: WritableDraft<PaletteState>, action: T) => void,
) => {
  return (state: WritableDraft<PaletteState>, action: T) => {
    state.past.push(extractCurrentPalette(state));
    state.future = []; // Clear future when a new action is taken
    reducer(state, action);
  };
};

export const generateNewPalette = createAsyncThunk<
  ColorSwatchType[],
  void,
  { state: RootState }
>("palette/generateNewPalette", async (_, { getState }) => {
  const { lockedIndices, currentPalette } = getState().palette as PaletteState;
  const paletteSize = currentPalette.length || DefaultPaletteSize;
  const newColors = generatePalette({
    paletteSize,
    lockedIndices,
    currentPalette,
  });
  return newColors.map((color) => ({ ...color, id: generateUniqueId() }));
});

const paletteSlice = createAppSlice({
  name: "palette",
  initialState,
  reducers: {
    undo: (state) => {
      if (state.past.length > 0) {
        const previousState = state.past.pop()!;
        state.future.unshift(extractCurrentPalette(state));
        Object.assign(state, previousState);
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        const nextState = state.future.shift()!;
        state.past.push(extractCurrentPalette(state));
        Object.assign(state, nextState);
      }
    },
    SYNC_BROWSER_FULLSCREEN_STATE: withHistory(
      (state, action: PayloadAction<{ isFullscreen: boolean }>) => {
        const targetViewMode = action.payload.isFullscreen ? "full" : "compact";
        if (state.viewMode !== targetViewMode) {
          state.viewMode = targetViewMode;
        }
      },
    ),
    toggleViewMode: withHistory((state) => {
      state.viewMode = state.viewMode === "compact" ? "full" : "compact";
    }),
    toggleLayout: withHistory((state) => {
      state.layout = state.layout === "horizontal" ? "vertical" : "horizontal";
    }),
    setPaletteSize: withHistory((state, action: PayloadAction<number>) => {
      const newSize = action.payload;
      if (newSize < MinPaletteSize || newSize > MaxPaletteSize) return;

      const currentSize = state.currentPalette.length;

      if (newSize > currentSize) {
        const newColors = generatePalette({
          paletteSize: newSize - currentSize,
          startColor: state.currentPalette[0]?.value,
        }).map((color) => ({ ...color, id: generateUniqueId() }));
        state.currentPalette.push(...newColors);
      } else if (newSize < currentSize) {
        const numToRemove = currentSize - newSize;
        const unlockedIndices = state.currentPalette
          .map((_, index) => index)
          .filter((index) => !state.lockedIndices.includes(index));

        const indicesToRemove = new Set<number>();

        for (
          let i = unlockedIndices.length - 1;
          i >= 0 && indicesToRemove.size < numToRemove;
          i--
        ) {
          indicesToRemove.add(unlockedIndices[i]);
        }

        if (indicesToRemove.size < numToRemove) {
          for (
            let i = currentSize - 1;
            i >= 0 && indicesToRemove.size < numToRemove;
            i--
          ) {
            if (!indicesToRemove.has(i)) {
              indicesToRemove.add(i);
            }
          }
        }

        const newPalette: ColorSwatchType[] = [];
        const newLockedIndices: number[] = [];
        let newIndex = 0;
        for (let i = 0; i < state.currentPalette.length; i++) {
          if (!indicesToRemove.has(i)) {
            newPalette.push(state.currentPalette[i]);
            if (state.lockedIndices.includes(i)) {
              newLockedIndices.push(newIndex);
            }
            newIndex++;
          }
        }

        state.currentPalette = newPalette;
        state.lockedIndices = newLockedIndices;
      }
    }),
    setPalette: withHistory(
      (state, action: PayloadAction<ColorSwatchType[]>) => {
        state.currentPalette = action.payload.map((color) => ({
          ...color,
          id: color.id || generateUniqueId(),
        }));
        state.lockedIndices = [];
      },
    ),
    toggleLock: withHistory((state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.currentPalette.findIndex(
        (swatch) => swatch.id === id,
      );
      if (index === -1) return;

      if (state.lockedIndices.includes(index)) {
        state.lockedIndices = state.lockedIndices.filter((i) => i !== index);
      } else {
        state.lockedIndices.push(index);
        state.lockedIndices.sort((a, b) => a - b);
      }
    }),
    deleteColor: withHistory((state, action: PayloadAction<string>) => {
      const idToDelete = action.payload;
      const indexToDelete = state.currentPalette.findIndex(
        (swatch) => swatch.id === idToDelete,
      );

      if (indexToDelete === -1) return;

      if (state.currentPalette.length > MinPaletteSize) {
        state.currentPalette.splice(indexToDelete, 1);
        state.lockedIndices = state.lockedIndices
          .map((lockedIndex) =>
            lockedIndex > indexToDelete ? lockedIndex - 1 : lockedIndex,
          )
          .filter((lockedIndex) => lockedIndex !== indexToDelete);
      }
    }),
    reorderPalette: withHistory(
      (
        state,
        action: PayloadAction<{ oldIndex: number; newIndex: number }>,
      ) => {
        const { oldIndex, newIndex } = action.payload;
        if (oldIndex === newIndex) return;

        const palette = state.currentPalette;
        const [movedItem] = palette.splice(oldIndex, 1);
        palette.splice(newIndex, 0, movedItem);

        const newLockedIndices: number[] = [];
        state.lockedIndices.forEach((oldLockedIndex) => {
          if (oldLockedIndex === oldIndex) {
            newLockedIndices.push(newIndex);
          } else if (oldIndex < newIndex) {
            if (oldLockedIndex > oldIndex && oldLockedIndex <= newIndex) {
              newLockedIndices.push(oldLockedIndex - 1);
            } else {
              newLockedIndices.push(oldLockedIndex);
            }
          } else {
            // oldIndex > newIndex
            if (oldLockedIndex >= newIndex && oldLockedIndex < oldIndex) {
              newLockedIndices.push(oldLockedIndex + 1);
            } else {
              newLockedIndices.push(oldLockedIndex);
            }
          }
        });
        state.lockedIndices = newLockedIndices.sort((a, b) => a - b);
      },
    ),
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateNewPalette.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        generateNewPalette.fulfilled,
        withHistory((state, action: PayloadAction<ColorSwatchType[]>) => {
          state.status = "idle";
          const newPalette = action.payload;
          const finalPalette = state.currentPalette.map((oldSwatch, index) => {
            if (state.lockedIndices.includes(index)) {
              return oldSwatch;
            }
            return newPalette[index];
          });
          state.currentPalette = finalPalette;
        }),
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
