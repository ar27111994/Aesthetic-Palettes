// lib/hooks/useFullscreenOnViewModeToggle.ts
import { useEffect, useRef, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/useApp';
import { useAriaAnnouncer } from './useAriaAnnouncer';
import { useTranslations } from 'next-intl';

// Transition timing in milliseconds
export const TRANSITION_DURATION = 400;

/**
 * Custom hook to synchronize browser fullscreen mode with the Redux 'viewMode' state.
 * It attempts to enter/exit fullscreen on '#palette-container' when 'viewMode' changes,
 * and syncs Redux state if fullscreen is changed externally (e.g., ESC key).
 * 
 * @returns An object with utility functions and state information
 */
export const useFullscreenOnViewModeToggle = () => {
  const dispatch = useAppDispatch();
  const { viewMode } = useAppSelector((state) => state.palette);
  const announce = useAriaAnnouncer();
  const t = useTranslations('Fullscreen');
  const isTransitioningRef = useRef(false);
  
  // Track transition state for animations
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Refs for tracking fullscreen state and transitions
  const isInternallyChangingFullscreen = useRef(false);
  const internalChangeExpectedState = useRef<boolean | null>(null);

  // Cleanup function to clear timeouts and event listeners
  const cleanup = useCallback(() => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  // Handle fullscreen errors with user feedback
  const handleFullscreenError = useCallback((error: unknown, action: 'enter' | 'exit') => {
    console.error(`Failed to ${action} fullscreen:`, error);
    announce(t(`fullscreen.${action}.error`));
    isInternallyChangingFullscreen.current = false;
    internalChangeExpectedState.current = null;
  }, [announce, t]);

  // Add CSS class for transition effects
  const setTransitionClass = useCallback((add: boolean) => {
    const paletteContainer = document.getElementById("palette-container");
    if (paletteContainer) {
      if (add) {
        paletteContainer.classList.add('fullscreen-transition');
      } else {
        // Remove after transition completes
        const onTransitionEnd = () => {
          paletteContainer.classList.remove('fullscreen-transition');
          paletteContainer.removeEventListener('transitionend', onTransitionEnd);
        };
        paletteContainer.addEventListener('transitionend', onTransitionEnd);
      }
    }
  }, []);

  // Effect 1: Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Effect 2: React to 'viewMode' changes from Redux and try to match browser fullscreen state.
  useEffect(() => {
    const paletteContainer = document.getElementById("palette-container");

    if (!document.fullscreenEnabled) {
      console.warn("Fullscreen API is not enabled or available.");
      announce(t("fullscreen.notSupported"));
      return;
    }

    if (!paletteContainer) {
      console.warn("Palette container element ('#palette-container') not found.");
      return;
    }

    const shouldBrowserBeFullscreen = viewMode === "full";
    const isPaletteContainerCurrentlyFullscreen =
      document.fullscreenElement === paletteContainer;

    const manageFullscreen = async () => {
      try {
        // Add transition class before starting the fullscreen change
        setTransitionClass(true);
        
        if (shouldBrowserBeFullscreen) {
          if (!isPaletteContainerCurrentlyFullscreen) {
            isInternallyChangingFullscreen.current = true;
            internalChangeExpectedState.current = true;
            
            // Announce the action to screen readers
            announce(t("fullscreen.enter.announce"));
            
            try {
              await paletteContainer.requestFullscreen();
              // The 'fullscreenchange' event will handle the success case
            } catch (error) {
              handleFullscreenError(error, 'enter');
            }
          } else {
            // Already in the correct state
            isInternallyChangingFullscreen.current = false;
            internalChangeExpectedState.current = null;
          }
        } else {
          // shouldBrowserBeFullscreen is false
          if (isPaletteContainerCurrentlyFullscreen) {
            isInternallyChangingFullscreen.current = true;
            internalChangeExpectedState.current = false;
            
            // Announce the action to screen readers
            announce(t("fullscreen.exit.announce"));
            
            try {
              await document.exitFullscreen();
              // The 'fullscreenchange' event will handle the success case
            } catch (error) {
              handleFullscreenError(error, 'exit');
            }
          } else {
            // Already in the correct state
            isInternallyChangingFullscreen.current = false;
            internalChangeExpectedState.current = null;
          }
        }
      } finally {
        // Remove transition class after a short delay
        transitionTimerRef.current = setTimeout(() => {
          setTransitionClass(false);
        }, 300);
      }
    };

    // Only trigger manageFullscreen if there's a discrepancy or if an internal change isn't already correctly reflected.
    if (shouldBrowserBeFullscreen !== isPaletteContainerCurrentlyFullscreen) {
      // If an internal change is already in progress that aims for the current `shouldBrowserBeFullscreen` state,
      // let the 'fullscreenchange' event handler manage the flag reset. Avoid re-triggering.
      if (
        !isInternallyChangingFullscreen.current ||
        internalChangeExpectedState.current !== shouldBrowserBeFullscreen
      ) {
        manageFullscreen();
      }
    } else {
      // Browser state matches Redux desired state. Ensure flags are clear.
      if (isInternallyChangingFullscreen.current) {
        // If a flag was set but state now matches, clear it.
        isInternallyChangingFullscreen.current = false;
        internalChangeExpectedState.current = null;
      }
    }
  }, [viewMode]); // Rerun this effect if 'viewMode' from Redux changes. Dispatch is stable.

  // Effect 3: Listen to actual browser 'fullscreenchange' events.
  useEffect(() => {
    const handleBrowserFullscreenChange = () => {
      const isBrowserActuallyFullscreen = !!document.fullscreenElement;
      const reduxWantsFullscreen = viewMode === "full";
      
      // Announce the new state to screen readers
      if (isBrowserActuallyFullscreen) {
        announce(t("fullscreen.enter.success"));
      } else {
        announce(t("fullscreen.exit.success"));
      }

      if (isInternallyChangingFullscreen.current) {
        // This event was likely due to a programmatic change from this hook.
        if (
          internalChangeExpectedState.current !== isBrowserActuallyFullscreen
        ) {
          console.warn(
            `Internal fullscreen change MISMATCHED. Expected: ${internalChangeExpectedState.current}, Got: ${isBrowserActuallyFullscreen}. Syncing Redux.`,
          );
          // The internal attempt didn't result in the expected state (e.g., request failed, or user intervened quickly).
          // We must sync Redux to the actual new browser state.
          if (reduxWantsFullscreen !== isBrowserActuallyFullscreen) {
            dispatch({
              type: "palette/SYNC_BROWSER_FULLSCREEN_STATE",
              payload: { isFullscreen: isBrowserActuallyFullscreen },
            });
          }
        }
        // Reset flags now that the internal operation (and its corresponding event) has been processed.
        isInternallyChangingFullscreen.current = false;
        internalChangeExpectedState.current = null;
        return;
      }

      // If not an internal change, it's external (e.g., ESC, F11).
      // Sync Redux state if it doesn't match the new browser reality.
      if (reduxWantsFullscreen !== isBrowserActuallyFullscreen) {
        dispatch({
          type: "palette/SYNC_BROWSER_FULLSCREEN_STATE",
          payload: { isFullscreen: isBrowserActuallyFullscreen },
        });
      }
    };

    const fullscreenEvents = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
    ];
    fullscreenEvents.forEach((event) =>
      document.addEventListener(event, handleBrowserFullscreenChange),
    );

    // Add keyboard event listener for ESC key in fullscreen
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.fullscreenElement) {
        // Let the fullscreenchange handler handle the state update
        isInternallyChangingFullscreen.current = true;
        internalChangeExpectedState.current = false;
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    fullscreenEvents.forEach((event) =>
      document.addEventListener(event, handleBrowserFullscreenChange, { passive: true })
    );

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      fullscreenEvents.forEach((event) =>
        document.removeEventListener(event, handleBrowserFullscreenChange)
      );
      cleanup();
      isInternallyChangingFullscreen.current = false;
      internalChangeExpectedState.current = null;
    };
  }, [dispatch, viewMode]); // Rerun if dispatch or viewMode changes. viewMode ensures fresh closure value.

  const toggleFullscreen = useCallback(async () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    
    // Clear any existing timers
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    try {
      if (viewMode === 'compact') {
        // Entering fullscreen
        if (!document.fullscreenEnabled) {
          announce(t('fullscreenNotSupported'));
          setIsTransitioning(false);
          isTransitioningRef.current = false;
          return;
        }

        try {
          await document.documentElement.requestFullscreen();
          // The actual view mode change will be handled by the fullscreenchange event listener
        } catch (error) {
          console.error('Error entering fullscreen:', error);
          announce(t('fullscreenError'));
          setIsTransitioning(false);
          isTransitioningRef.current = false;
        }
      } else {
        // Exiting fullscreen
        if (document.fullscreenElement) {
          try {
            await document.exitFullscreen();
            // The actual view mode change will be handled by the fullscreenchange event listener
          } catch (error) {
            console.error('Error exiting fullscreen:', error);
            announce(t('fullscreenExitError'));
            setIsTransitioning(false);
            isTransitioningRef.current = false;
          }
        } else {
          // If not in fullscreen but viewMode is 'full', sync the state
          dispatch({
            type: 'palette/toggleViewMode',
            payload: { viewMode: 'compact' },
          });
          // Set a timer to reset the transitioning state
          transitionTimerRef.current = setTimeout(() => {
            setIsTransitioning(false);
            isTransitioningRef.current = false;
          }, TRANSITION_DURATION);
        }
      }
    } catch (error) {
      console.error('Error in toggleFullscreen:', error);
      setIsTransitioning(false);
      isTransitioningRef.current = false;
    }
  }, [dispatch, viewMode, announce, t]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  // Sync browser fullscreen state with Redux
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      
      // Only update if there's a mismatch between browser and Redux state
      if ((isFullscreen && viewMode === 'compact') || (!isFullscreen && viewMode === 'full')) {
        dispatch({
          type: 'palette/toggleViewMode',
          payload: { viewMode: isFullscreen ? 'full' : 'compact' },
        });
      }
      
      // Reset transitioning state when the animation completes
      transitionTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
        isTransitioningRef.current = false;
      }, TRANSITION_DURATION);
    };

    const fullscreenEvents = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
    ];
    fullscreenEvents.forEach((event) =>
      document.addEventListener(event, handleFullscreenChange),
    );

    // Cleanup function
    return () => {
      fullscreenEvents.forEach((event) =>
        document.removeEventListener(event, handleFullscreenChange)
      );
    };
  }, [dispatch, viewMode]); // Rerun if dispatch or viewMode changes. viewMode ensures fresh closure value.

  // Return utility functions and state information
  return {
    toggleFullscreen,
    isFullscreen: viewMode === 'full',
    isTransitioning,
    transitionDuration: TRANSITION_DURATION,
  };
};

// Add TypeScript type for the hook's return value
type UseFullscreenOnViewModeToggleReturn = {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
};

export type { UseFullscreenOnViewModeToggleReturn };
