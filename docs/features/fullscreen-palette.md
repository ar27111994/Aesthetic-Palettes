# Fullscreen Palette Display

This document provides an overview of the fullscreen palette display feature, including usage examples, customization options, and implementation details.

## Overview

The fullscreen palette display allows users to view and interact with color palettes in a fullscreen mode, providing an immersive experience for examining and working with colors. The feature includes:

- Smooth transitions between compact and fullscreen views
- Keyboard navigation and accessibility support
- Responsive design that works across different screen sizes
- Loading states and error handling
- Fallback UI for unsupported browsers

## Usage

### Basic Implementation

To use the fullscreen palette display in your component:

```tsx
import { useFullscreenOnViewModeToggle } from '@lib/hooks/useFullscreenOnViewModeToggle';
import { FullscreenControls } from '@components/FullscreenControls';

function PaletteDisplay() {
  // Use the hook to manage fullscreen state
  const { isFullscreen, toggleFullscreen, isTransitioning } = useFullscreenOnViewModeToggle();
  
  return (
    <div 
      id="palette-container"
      className={cn(
        'palette-container',
        { 'fullscreen': isFullscreen, 'transitioning': isTransitioning }
      )}
    >
      {/* Your palette content */}
      
      {/* Fullscreen controls */}
      <FullscreenControls 
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onExitFullscreen={() => toggleFullscreen()}
      />
    </div>
  );
}
```

### Props

#### useFullscreenOnViewModeToggle

This hook manages the fullscreen state and transitions.

**Returns:**

- `isFullscreen` (boolean): Whether the palette is currently in fullscreen mode
- `toggleFullscreen` (function): Toggles between fullscreen and compact views
- `isTransitioning` (boolean): Whether a transition is currently in progress
- `error` (Error | null): Any error that occurred during fullscreen operations

#### FullscreenControls

A component that renders the fullscreen control buttons.

**Props:**

- `isFullscreen` (boolean): Whether the palette is currently in fullscreen mode
- `onToggleFullscreen` (function): Called when the fullscreen toggle button is clicked
- `onExitFullscreen` (function): Called when the exit fullscreen button is clicked
- `className` (string, optional): Additional CSS class names

## Customization

### Styling

The fullscreen palette can be styled using CSS. The following classes are available:

- `.palette-container`: The main container element
- `.palette-container.fullscreen`: Applied when in fullscreen mode
- `.palette-container.transitioning`: Applied during transitions
- `.fullscreen-controls`: The fullscreen controls container
- `.fullscreen-button`: The toggle fullscreen button
- `.exit-fullscreen-button`: The exit fullscreen button

Example CSS:

```css
.palette-container {
  transition: all 0.3s ease;
}

.palette-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background: var(--color-background-page);
}

.fullscreen-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1001;
}
```

### Keyboard Shortcuts

The following keyboard shortcuts are available in fullscreen mode:

- `Escape`: Exit fullscreen mode
- `F11`: Toggle fullscreen mode (browser-dependent)
- `Tab`: Navigate between interactive elements

### Accessibility

The fullscreen palette includes the following accessibility features:

- ARIA attributes for screen readers
- Keyboard navigation
- Focus management
- High contrast mode support
- Screen reader announcements for state changes

## Error Handling

The component handles the following error cases:

- Browser doesn't support the Fullscreen API
- Fullscreen request was denied
- Fullscreen element could not be activated

Error messages are displayed to the user and announced via ARIA live regions.

## Browser Support

The fullscreen palette is supported in all modern browsers that implement the Fullscreen API:

- Chrome 15+
- Firefox 10+
- Safari 5.1+
- Edge 12+
- Opera 15+

For unsupported browsers, a fallback UI is displayed.

## Testing

### Unit Tests

Run the unit tests with:

```bash
npm test
```

### E2E Tests

Run the E2E tests with:

```bash
npm run test:e2e
```

## Troubleshooting

### Fullscreen not working

1. Check if the browser supports the Fullscreen API:

   ```javascript
   document.fullscreenEnabled
   ```


2. Ensure the element has the correct dimensions before entering fullscreen

3. Check the browser console for any error messages

### Styling issues in fullscreen mode

1. Make sure all parent elements have `position: static` (the default)
2. Check for conflicting z-index values
3. Verify that transitions are working as expected

## Related Components

- `PaletteDisplay`: The main palette display component
- `ColorSwatch`: Individual color swatch component
- `ViewOptions`: Component for toggling view modes

## See Also

- [MDN Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/)
