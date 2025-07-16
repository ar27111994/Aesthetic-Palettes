// Test setup with TypeScript support
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

// Configure test timeout
jest.setTimeout(10000);

// Configure test environment
configure({ testIdAttribute: 'data-testid' });

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
  useMessages: () => ({}),
  NextIntlClientProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
}));

// Test wrapper component
interface TestWrapperProps {
  children: ReactNode;
  messages?: Record<string, string>;
}

function TestWrapper({ children, messages = {} }: TestWrapperProps) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    messages?: Record<string, string>;
  }
) => {
  const { messages = {}, ...restOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper messages={messages}>{children}</TestWrapper>
    ),
    ...restOptions,
  });
};

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

class IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  
  constructor(private callback: IntersectionObserverCallback) {}
  
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}
window.IntersectionObserver = IntersectionObserver;

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
