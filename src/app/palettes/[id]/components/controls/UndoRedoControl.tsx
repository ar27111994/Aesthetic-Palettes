// app/palettes/[id]/components/controls/UndoRedoControl.tsx
import React, { memo } from "react";
import { Button } from "@components/Button";
import { FiRotateCcw, FiRotateCw } from "react-icons/fi";

/**
 * Props for the UndoRedoControl component.
 * @interface UndoRedoControlProps
 */
interface UndoRedoControlProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  undoLabel: string;
  redoLabel: string;
}

/**
 * UndoRedoControl component renders buttons for undoing and redoing palette actions.
 * @component
 * @param {UndoRedoControlProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered UndoRedoControl component.
 */
export const UndoRedoControl: React.FC<UndoRedoControlProps> = memo(
  ({ onUndo, onRedo, canUndo, canRedo, undoLabel, redoLabel }) => {
    return (
      <div
        className="flex items-center gap-1"
        role="group"
        aria-label="Undo and redo controls"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onUndo}
          aria-label={undoLabel}
          aria-describedby="undo-description"
          disabled={!canUndo}
        >
          <FiRotateCcw className="h-5 w-5" aria-hidden="true" />
          <span id="undo-description" className="sr-only">
            {undoLabel}
          </span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRedo}
          aria-label={redoLabel}
          aria-describedby="redo-description"
          disabled={!canRedo}
        >
          <FiRotateCw className="h-5 w-5" aria-hidden="true" />
          <span id="redo-description" className="sr-only">
            {redoLabel}
          </span>
        </Button>
      </div>
    );
  },
);

UndoRedoControl.displayName = "UndoRedoControl";
