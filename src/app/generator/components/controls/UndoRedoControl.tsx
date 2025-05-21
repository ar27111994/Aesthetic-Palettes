// app/generator/components/controls/UndoRedoControl.tsx
import React from "react";
import { Button } from "@components/Button";
import { FiRotateCcw, FiRotateCw } from "react-icons/fi";

interface UndoRedoControlProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  undoLabel: string;
  redoLabel: string;
}

export const UndoRedoControl: React.FC<UndoRedoControlProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  undoLabel,
  redoLabel,
}) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={onUndo}
        aria-label={undoLabel}
        disabled={!canUndo}
      >
        <FiRotateCcw className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRedo}
        aria-label={redoLabel}
        disabled={!canRedo}
      >
        <FiRotateCw className="h-5 w-5" />
      </Button>
    </div>
  );
};
