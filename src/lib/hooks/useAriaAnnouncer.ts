"use client";

import { useEffect, useRef } from 'react';

/**
 * Custom hook for making screen reader announcements.
 * Creates a live region that can be used to announce changes to screen readers.
 * 
 * @returns A function that announces a message to screen readers.
 * 
 * @example
 * const announce = useAriaAnnouncer();
 * announce('Changes saved successfully');
 */
export const useAriaAnnouncer = (): ((message: string) => void) => {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create a live region element for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('role', 'status');
    
    // Visually hide the live region
    Object.assign(liveRegion.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    });

    // Add the live region to the document body
    document.body.appendChild(liveRegion);
    liveRegionRef.current = liveRegion;

    // Clean up the live region when the component unmounts
    return () => {
      if (document.body.contains(liveRegion)) {
        document.body.removeChild(liveRegion);
      }
    };
  }, []);

  /**
   * Announces a message to screen readers.
   * @param message - The message to announce.
   */
  const announce = (message: string): void => {
    if (!liveRegionRef.current) return;
    
    // Clear any existing content
    liveRegionRef.current.textContent = '';
    
    // Use setTimeout to ensure the browser processes the DOM changes
    // and announces the new content
    setTimeout(() => {
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = message;
      }
    }, 100);
  };

  return announce;
};

export default useAriaAnnouncer;
