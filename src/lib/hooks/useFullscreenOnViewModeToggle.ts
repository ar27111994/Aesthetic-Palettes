// lib/hooks/useFullscreenOnViewModeToggle.ts
import { useEffect } from "react";
import { addListener } from "@reduxjs/toolkit";
import { useAppDispatch } from "@hooks/useApp";

/**
 * Custom hook to toggle fullscreen mode when the 'palette/toggleViewMode' action is dispatched.
 * It listens for this specific Redux action and attempts to enter or exit fullscreen
 * on the element with ID 'palette-container'.
 */
export const useFullscreenOnViewModeToggle = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Effect to be run when 'palette/toggleViewMode' is dispatched
    const effect = async () => {
      console.log(
        "View mode changed detected. Current fullscreenElement:",
        document.fullscreenElement,
      );
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
          console.log("Exited fullscreen.");
        } else {
          const paletteContainer = document.getElementById("palette-container");
          console.log("Palette Container for fullscreen:", paletteContainer);
          if (paletteContainer) {
            await paletteContainer.requestFullscreen();
            console.log("Entered fullscreen.");
          } else {
            console.warn(
              "Palette container element not found for fullscreen request.",
            );
          }
        }
      } catch (error) {
        console.error("Fullscreen API error:", error);
      }
    };

    // Subscribe to the store using addListener.
    // This sets up a listener that runs the `effect` *after* the 'palette/toggleViewMode' action has been processed by reducers.
    const listenerEntry = dispatch(
      addListener({
        type: "palette/toggleViewMode", // Action type to listen for
        effect, // The function to run
      }),
    );

    // Cleanup function: Unsubscribe the listener when the component unmounts
    // or when the dispatch function instance changes (which is rare for standard Redux setup).
    return () => {
      listenerEntry?.payload?.unsubscribe();
    };
  }, [dispatch]); // Dependency array includes dispatch to adhere to exhaustive-deps,
  // though dispatch function from useStore() or useDispatch() is typically stable.
};
