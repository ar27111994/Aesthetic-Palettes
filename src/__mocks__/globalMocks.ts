import React from 'react';

// Mock for next/head
export const mockNextHead = () => {
  const originalModule = jest.requireActual('next/head');
  const MockHead: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return React.createElement(React.Fragment, null, children);
  };
  return {
    __esModule: true,
    ...originalModule,
    default: MockHead,
  };
};

// Mock for next/router
const useRouter = jest.spyOn(require('next/router'), 'useRouter');
useRouter.mockImplementation(() => ({
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: () => Promise.resolve(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
}));

// Mock for next/image
const Image: React.FC<{ src: string; alt: string; [key: string]: any }> = ({ src, alt, ...props }) => {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return React.createElement('img', { src, alt, ...props });
};

jest.mock('next/image', () => ({
  __esModule: true,
  default: Image,
}));

// Mock for next/link
const MockLink: React.FC<{ href: string; [key: string]: any }> = ({ children, href, ...props }) => {
  return React.createElement('a', { href, ...props }, children);
};

jest.mock('next/link', () => MockLink);
