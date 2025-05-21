// app/generator/components/PaletteDisplay.tsx
import React from "react";
import { ColorSwatch } from "@components/ColorSwatch";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MappedPaletteItem } from "@hooks/usePaletteManagement"; // Re-using the type
import { cn } from "@utils/cn";
import { PaletteLayout } from "@typings/PaletteState";

interface PaletteDisplayProps {
  items: MappedPaletteItem[];
  layout: PaletteLayout;
  lockedIndices: number[];
  sensors: SensorDescriptor<SensorOptions>[];
  onDragEnd: (event: DragEndEvent) => void;
  onLockToggle: (id: string) => void;
  onAdjust: (color: string) => void;
  onDelete: (id: string) => void;
}

export const PaletteDisplay: React.FC<PaletteDisplayProps> = ({
  items,
  layout,
  lockedIndices,
  sensors,
  onDragEnd,
  onLockToggle,
  onAdjust,
  onDelete,
}) => {
  return (
    <div id="palette-container" className="flex flex-grow">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)} // Pass array of IDs
          strategy={
            layout === "vertical"
              ? horizontalListSortingStrategy // For side-by-side items (row)
              : verticalListSortingStrategy // For top-to-bottom items (column)
          }
        >
          <div className="bg-background-page flex flex-grow items-stretch justify-center">
            {/* Main palette swatches area */}
            <div
              className={cn("flex h-full w-full", {
                "flex-col": layout === "horizontal", // Stack swatches vertically (e.g. like a column)
                "flex-row": layout === "vertical", // Place swatches horizontally (e.g. like a row)
              })}
            >
              {items.map((item, index) => (
                <ColorSwatch
                  key={item.id} // Use item.id as key
                  id={item.id} // Pass id prop for dnd-kit
                  color={item.value}
                  isLocked={lockedIndices.includes(index)} // Optimized: Check lock status using the item's current index
                  onLockToggle={() => onLockToggle(item.id)} // Pass id
                  onAdjust={() => onAdjust(item.value)}
                  onDelete={() => onDelete(item.id)} // Pass id
                  className="h-full min-w-0 flex-1" // Ensure swatches take available space
                />
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
