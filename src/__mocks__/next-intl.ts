// Mock implementation for next-intl module
export function useTranslations(namespace: string) {
  return (key: string) => {
    // Return a simple translation string for testing
    return `translated:${namespace}.${key}`;
  };
}

// Mock other next-intl exports if needed
export const IntlProvider = ({ children }: { children: React.ReactNode }) => children;
