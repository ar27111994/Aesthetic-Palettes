// lib/hooks/usePaletteManagement.ts
import { type RootState } from "@lib/store";
import {
  type PaletteState,
  type ColorSwatch,
  MinPaletteSize,
  MaxPaletteSize,
} from "@typings/PaletteState";
import {
  generateNewPalette,
  toggleLock,
  deleteColor,
  reorderPalette,
  undo,
  redo,
  setPaletteSize,
} from "@features/palette/paletteSlice";
import { useAppDispatch, useAppSelector } from "@hooks/useApp";

export const usePaletteManagement = () => {
  const dispatch = useAppDispatch();
  const { currentPalette, lockedIndices, past, future, layout, viewMode } =
    useAppSelector((state: RootState) => state.palette as PaletteState);

  const paletteSize = currentPalette.length;

  const items: ColorSwatch[] = currentPalette;

  // Action handlers
  const handleGenerate = () => dispatch(generateNewPalette());
  const handleLockToggle = (id: string) => dispatch(toggleLock(id));
  const handleDeleteColor = (id: string) => dispatch(deleteColor(id));
  const handleReorderPalette = (payload: {
    oldIndex: number;
    newIndex: number;
  }) => dispatch(reorderPalette(payload));
  const handleUndo = () => dispatch(undo());
  const handleRedo = () => dispatch(redo());
  const handleSetPaletteSize = (newSize: number) => {
    const size = Math.max(MinPaletteSize, Math.min(MaxPaletteSize, newSize)); // Clamp size between 3 and 10
    dispatch(setPaletteSize(size));
  };

  return {
    // State
    currentPalette, // Raw palette data if needed elsewhere
    lockedIndices,
    past,
    future,
    layout,
    viewMode,
    paletteSize,
    items, // Mapped items with IDs for dnd-kit and rendering
    // Actions
    dispatchGenerate: handleGenerate,
    dispatchToggleLock: handleLockToggle,
    dispatchDeleteColor: handleDeleteColor,
    dispatchReorderPalette: handleReorderPalette,
    dispatchUndo: handleUndo,
    dispatchRedo: handleRedo,
    dispatchSetPaletteSize: handleSetPaletteSize,
    // Raw dispatch if needed for other actions like addListener
    dispatch,
  };
};
