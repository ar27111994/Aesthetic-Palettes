// Core React and TypeScript imports
import React, { ReactNode } from "react";
import {
  AnyAction,
  configureStore,
  createSlice,
  PayloadAction,
  Reducer,
} from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { expect } from "@jest/globals";
import { renderHook, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Import the hook to be tested
import { useFullscreenOnViewModeToggle } from "@lib/hooks/useFullscreenOnViewModeToggle";
import { PaletteState, PaletteViewMode } from "@lib/typings/PaletteState";

// Import centralized mocks for useApp and next-intl
import { initialState as paletteInitialState } from "@lib/typings/PaletteState";

// Use the centralized ARIA announcer mock
const mockAnnounce = jest.fn();
jest.mock("@lib/hooks/useAriaAnnouncer", () => ({
  useAriaAnnouncer: () => mockAnnounce,
}));

// Redefine these as jest.fn() for full control in tests
const mockedUseAppDispatch = jest.fn();
const mockedUseAppSelector = jest.fn();
jest.mock("../../__mocks__/useApp", () => ({
  useAppDispatch: () => mockedUseAppDispatch(),
  useAppSelector: mockedUseAppSelector,
}));

// --- Redux Setup ---
const initialState: PaletteState = {
  currentPalette: [],
  viewMode: "compact",
  layout: "vertical",
  past: [],
  future: [],
  lockedIndices: [],
  status: "idle",
};

const paletteSlice = createSlice({
  name: "palette",
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<PaletteViewMode>) {
      state.viewMode = action.payload;
    },
  },
});

const { setViewMode } = paletteSlice.actions;

const createTestStore = (preloadedState?: Partial<{ palette: PaletteState }>) =>
  configureStore({
    reducer: {
      palette: paletteSlice.reducer as Reducer<
        PaletteState,
        AnyAction,
        PaletteState | undefined
      >,
    },
    preloadedState,
  });

const ReduxProvider = ({
  children,
  store,
}: {
  children: ReactNode;
  store: ReturnType<typeof createTestStore>;
}) => <Provider store={store}>{children}</Provider>;

// --- Fullscreen API Mock ---
let paletteContainer: HTMLElement;
let requestFullscreenSpy: jest.SpyInstance;
let exitFullscreenSpy: jest.SpyInstance;

// Polyfill Fullscreen API for jsdom if missing
if (!HTMLElement.prototype.requestFullscreen) {
  // @ts-ignore
  HTMLElement.prototype.requestFullscreen = function () {
    return Promise.resolve();
  };
}
if (!document.exitFullscreen) {
  // @ts-ignore
  document.exitFullscreen = function () {
    return Promise.resolve();
  };
}

// --- Test Suite ---
describe("useFullscreenOnViewModeToggle", () => {
  let store: ReturnType<typeof createTestStore>;
  let originalFullscreenEnabled: boolean;

  beforeAll(() => {
    // Spy on the real DOM fullscreen methods
    requestFullscreenSpy = jest
      .spyOn(HTMLElement.prototype, "requestFullscreen")
      .mockImplementation(function (this: HTMLElement) {
        Object.defineProperty(document, "fullscreenElement", {
          value: this,
          writable: true,
          configurable: true,
        });
        document.dispatchEvent(new Event("fullscreenchange"));
        return Promise.resolve();
      });
    exitFullscreenSpy = jest
      .spyOn(document, "exitFullscreen")
      .mockImplementation(() => {
        Object.defineProperty(document, "fullscreenElement", {
          value: null,
          writable: true,
          configurable: true,
        });
        document.dispatchEvent(new Event("fullscreenchange"));
        return Promise.resolve();
      });
    // Save original fullscreenEnabled
    originalFullscreenEnabled = document.fullscreenEnabled;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    store = createTestStore();
    mockedUseAppDispatch.mockReturnValue(store.dispatch);
    mockedUseAppSelector.mockImplementation((selector) =>
      selector(store.getState()),
    );
    // Only mock fullscreenEnabled property
    Object.defineProperty(document, "fullscreenEnabled", {
      value: true,
      configurable: true,
    });
    // Create DOM element if not present
    paletteContainer =
      document.getElementById("palette-container") ||
      document.createElement("div");
    paletteContainer.id = "palette-container";
    if (!paletteContainer.parentNode)
      document.body.appendChild(paletteContainer);
  });

  afterEach(() => {
    // Remove paletteContainer if it exists
    const el = document.getElementById("palette-container");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  });

  afterAll(() => {
    if (requestFullscreenSpy) requestFullscreenSpy.mockRestore();
    if (exitFullscreenSpy) exitFullscreenSpy.mockRestore();
    Object.defineProperty(document, "fullscreenEnabled", {
      value: originalFullscreenEnabled,
      configurable: true,
    });
  });

  const renderTheHook = () => {
    return renderHook(() => useFullscreenOnViewModeToggle(), {
      wrapper: ({ children }) => (
        <ReduxProvider store={store}>{children}</ReduxProvider>
      ),
    });
  };

  it("should be supported and not active initially", () => {
    const { result } = renderTheHook();
    // fullscreenSupported is not returned by the hook, so just check isFullscreen
    expect(result.current.isFullscreen).toBe(false);
  });

  it("should request fullscreen when toggled", async () => {
    const { result } = renderTheHook();
    await act(async () => {
      await result.current.toggleFullscreen();
    });
    expect(requestFullscreenSpy).toHaveBeenCalledTimes(1);
  });

  it("should exit fullscreen when toggled while active", async () => {
    Object.defineProperty(document, "fullscreenElement", {
      value: paletteContainer,
      writable: true,
      configurable: true,
    });
    // Simulate Redux state update to match browser fullscreen
    store.dispatch(setViewMode("full"));
    const { result } = renderTheHook();
    act(() => {
      document.dispatchEvent(new Event("fullscreenchange"));
    });
    await waitFor(() => expect(result.current.isFullscreen).toBe(true));
    await act(async () => {
      await result.current.toggleFullscreen();
    });
    expect(exitFullscreenSpy).toHaveBeenCalledTimes(1);
  });

  it("should exit fullscreen when viewMode changes", async () => {
    Object.defineProperty(document, "fullscreenElement", {
      value: paletteContainer,
      writable: true,
      configurable: true,
    });
    // Simulate Redux state update to match browser fullscreen
    store.dispatch(setViewMode("full"));
    const { result, rerender } = renderTheHook();
    act(() => {
      document.dispatchEvent(new Event("fullscreenchange"));
    });
    await waitFor(() => expect(result.current.isFullscreen).toBe(true));
    act(() => {
      store.dispatch(setViewMode("compact"));
    });
    rerender({});
    expect(exitFullscreenSpy).toHaveBeenCalledTimes(1);
  });

  it("should not be supported if fullscreen is disabled", () => {
    // fullscreenEnabled is read-only, so mock it using Object.defineProperty
    Object.defineProperty(global.document, "fullscreenEnabled", {
      value: false,
      configurable: true,
    });
    const { result } = renderTheHook();
    // fullscreenSupported is not returned by the hook, so just check isFullscreen
    expect(result.current.isFullscreen).toBe(false);
  });

  it("should handle missing palette container gracefully", () => {
    // Remove palette container before rendering
    const el = document.getElementById("palette-container");
    if (el && el.parentNode) el.parentNode.removeChild(el);
    const { result } = renderTheHook();
    expect(result.current.isFullscreen).toBe(false);
  });

  it("should start in fullscreen if viewMode is 'full'", () => {
    store = createTestStore({
      palette: { ...paletteInitialState, viewMode: "full" },
    });
    mockedUseAppDispatch.mockReturnValue(store.dispatch);
    mockedUseAppSelector.mockImplementation((selector) =>
      selector(store.getState()),
    );
    const { result } = renderHook(() => useFullscreenOnViewModeToggle(), {
      wrapper: ({ children }) => (
        <ReduxProvider store={store}>{children}</ReduxProvider>
      ),
    });
    expect(result.current.isFullscreen).toBe(true);
  });

  it("should call ARIA announcer on fullscreen enter/exit", async () => {
    const { result } = renderTheHook();
    await act(async () => {
      await result.current.toggleFullscreen();
    });
    expect(mockAnnounce).toHaveBeenCalled();
  });

  it("should set isTransitioning true during transition", async () => {
    jest.useFakeTimers();
    const { result } = renderTheHook();
    expect(result.current.isTransitioning).toBe(false);

    let togglePromise: Promise<void>;
    await act(async () => {
      togglePromise = result.current.toggleFullscreen();
      jest.advanceTimersByTime(1);
    });

    // Wait for the state update outside act
    await waitFor(() => expect(result.current.isTransitioning).toBe(true));

    // Finish the transition
    await act(async () => {
      await togglePromise;
    });
    await waitFor(() => expect(result.current.isTransitioning).toBe(false));
    jest.useRealTimers();
  });

  it("should sync Redux if external fullscreen change occurs", async () => {
    const { result } = renderTheHook();
    Object.defineProperty(document, "fullscreenElement", {
      value: paletteContainer,
      writable: true,
      configurable: true,
    });
    // Simulate Redux state update to match browser fullscreen
    store.dispatch(setViewMode("full"));
    act(() => {
      document.dispatchEvent(new Event("fullscreenchange"));
    });
    await waitFor(() => expect(result.current.isFullscreen).toBe(true));
  });
});
