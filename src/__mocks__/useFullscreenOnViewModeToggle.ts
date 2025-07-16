import { useFullscreenOnViewModeToggle as actualUseFullscreenOnViewModeToggle } from "@lib/hooks/useFullscreenOnViewModeToggle";

// Create a typed mock function
const mockUseFullscreenOnViewModeToggle = jest.fn() as jest.MockedFunction<
  typeof actualUseFullscreenOnViewModeToggle
>;

// Set up the default implementation to use the actual implementation
mockUseFullscreenOnViewModeToggle.mockImplementation(
  actualUseFullscreenOnViewModeToggle
);

export { mockUseFullscreenOnViewModeToggle as useFullscreenOnViewModeToggle };
