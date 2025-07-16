// app/palettes/[id]/components/PaletteDisplay.tsx
import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  Suspense,
} from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DropAnimation,
  useSensor,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@utils/cn";
import { ColorSwatch } from "@components/ColorSwatch";
import { FullscreenControls } from "./FullscreenControls";
import {
  ColorSwatch as PaletteItem,
  PaletteLayout,
} from "@typings/PaletteState";
import { useAppDispatch, useAppSelector } from "@hooks/useApp";
import { RootState } from "@lib/store";
import { useAriaAnnouncer } from "@lib/hooks/useAriaAnnouncer";
import { useTranslations } from "next-intl";

// Animation configuration for drag and drop
const dropAnimationConfig: DropAnimation = {
  easing: "cubic-bezier(0.18, 0.67, 0.6, 0.99)",
  duration: 200,
};

/**
 * Props for the PaletteDisplay component.
 * @interface PaletteDisplayProps
 */
interface PaletteDisplayProps {
  items: PaletteItem[];
  layout: PaletteLayout;
  lockedIndices: number[];
  onDragEnd: (event: DragEndEvent) => void;
  onLockToggle: (id: string) => void;
  onAdjust: (color: string) => void;
  onDelete: (id: string) => void;
  className?: string;
  sensors?: Array<SensorDescriptor<SensorOptions>>; // Optional sensors for drag-and-drop
}

/**
 * PaletteDisplay component renders the color palette with drag-and-drop functionality.
 * @component
 * @param {PaletteDisplayProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered PaletteDisplay component.
 */
export const PaletteDisplay: React.FC<PaletteDisplayProps> = ({
  items,
  layout,
  lockedIndices,
  onDragEnd,
  onLockToggle,
  onAdjust,
  onDelete,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const announce = useAriaAnnouncer();
  const t = useTranslations("PaletteDisplay");
  const dispatch = useAppDispatch();
  const { viewMode } = useAppSelector((state: RootState) => state.palette);
  const [isBrowserSupported, setIsBrowserSupported] = useState<boolean | null>(
    null,
  );
  const [isInitializing, setIsInitializing] = useState(true);

  // Configure sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Handle drag end with accessibility announcements
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        announce(t("colorMoved", { from: oldIndex + 1, to: newIndex + 1 }));
      }
      onDragEnd(event);
    },
    [items, onDragEnd, announce, t],
  );

  // Check browser support
  useEffect(() => {
    const checkBrowserSupport = async () => {
      try {
        const supported =
          typeof document !== "undefined" &&
          (document.fullscreenEnabled ||
            (document as any).webkitFullscreenEnabled ||
            (document as any).mozFullScreenEnabled ||
            (document as any).msFullscreenEnabled);
        setIsBrowserSupported(!!supported);
      } catch (error) {
        console.error("Error checking browser support:", error);
        setIsBrowserSupported(false);
      } finally {
        setIsInitializing(false);
      }
    };
    checkBrowserSupport();
  }, []);

  // Fullscreen styles
  const fullscreenStyles =
    viewMode === "full"
      ? {
          minHeight: "100vh",
          width: "100%",
          backgroundColor: "var(--color-background-page)",
        }
      : {};

  if (isInitializing) {
    return (
      <div
        className="flex h-full w-full items-center justify-center"
        aria-live="polite"
      >
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isBrowserSupported === false) {
    return (
      <div className="p-4 text-center" role="alert">
        <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {t("fullscreenNotSupported", {
                  defaultValue:
                    "Your browser does not support all features required for fullscreen mode.",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="palette-container"
      ref={containerRef}
      className={cn(
        "relative flex flex-grow transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
        className,
        {
          "p-4": viewMode === "compact",
          "p-0": viewMode === "full",
          "fullscreen-active": viewMode === "full",
        },
      )}
      style={fullscreenStyles}
      aria-label={viewMode === "full" ? t("fullscreenPalette") : t("palette")}
      data-fullscreen={viewMode === "full"}
      data-supported={isBrowserSupported}
    >
      <div
        className={cn(
          "absolute top-0 right-0 z-50 transition-opacity duration-300",
          {
            "pointer-events-none opacity-0": viewMode !== "full",
            "opacity-100": viewMode === "full",
          },
        )}
      >
        {viewMode === "full" && (
          <FullscreenControls
            onClose={() =>
              dispatch({
                type: "palette/toggleViewMode",
                payload: { viewMode: "compact" },
              })
            }
          />
        )}
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        accessibility={{
          announcements: {
            onDragStart: ({ active }) =>
              t("draggingStarted", { id: active.id }),
            onDragOver: ({ active, over }) =>
              over ? t("draggingOver", { id: active.id, overId: over.id }) : "",
            onDragEnd: ({ active, over }) =>
              over
                ? t("dragEnded", { id: active.id, overId: over.id })
                : t("dragEndedNoTarget", { id: active.id }),
            onDragCancel: ({ active }) => t("dragCancelled", { id: active.id }),
          },
          screenReaderInstructions: {
            draggable: t("screenReaderDraggable", {
              defaultValue: "Press space or enter to drag",
            }),
          },
        }}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={
            layout === "vertical"
              ? horizontalListSortingStrategy
              : verticalListSortingStrategy
          }
        >
          <div
            className={cn("flex w-full transition-all duration-300", {
              "h-full": viewMode === "full",
              "rounded-lg shadow-md": viewMode === "compact",
              "bg-background-page": true,
              "overflow-hidden": true,
            })}
          >
            <div
              className={cn("flex w-full", {
                "flex-col": layout === "horizontal",
                "flex-row": layout === "vertical",
                "h-full": viewMode === "full",
              })}
              role="list"
              aria-label={t("colorSwatches", {
                defaultValue: "Color swatches",
              })}
            >
              {items.map((item, index) => (
                <Suspense
                  key={item.id}
                  fallback={
                    <div className="h-32 w-full animate-pulse bg-gray-200"></div>
                  }
                >
                  <ColorSwatch
                    id={item.id}
                    color={item.value}
                    isLocked={lockedIndices.includes(index)}
                    onLockToggle={() => onLockToggle(item.id)}
                    onAdjust={() => onAdjust(item.value)}
                    onDelete={() => onDelete(item.id)}
                    className={cn(
                      "transition-all duration-300 ease-in-out",
                      "focus:ring-primary/50 focus:ring-2 focus:ring-offset-2 focus:outline-none",
                      "hover:brightness-110",
                      "min-w-0 flex-1",
                      {
                        "h-full": layout === "vertical" || viewMode === "full",
                        "h-32 md:h-48 lg:h-64":
                          layout === "horizontal" && viewMode === "compact",
                      },
                    )}
                    aria-label={t("colorSwatch", {
                      index: index + 1,
                      hex: item.value,
                    })}
                    aria-roledescription={t("draggable", {
                      defaultValue: "draggable color swatch",
                    })}
                  />
                </Suspense>
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default PaletteDisplay;
