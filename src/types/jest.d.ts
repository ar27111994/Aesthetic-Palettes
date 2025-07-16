// This file extends Jest's type definitions
import '@testing-library/jest-dom';

// Extend the global Jest namespace
declare global {
  namespace jest {
    // Extend Jest's matchers with custom ones if needed
    interface Matchers<R> {
      // Add any custom matchers here
      toBeGreaterThan(expected: number): R;
    }
  }
  namespace jest {
    interface Matchers<R> {
      /**
       * Ensures the last called mock function was called with the specified arguments.
       */
      toHaveBeenCalledWith(...args: any[]): R;
      
      /**
       * Ensures that a mock function is called with specific arguments.
       */
      toBeCalledWith(...args: any[]): R;
      
      /**
       * Ensures that a mock function is called.
       */
      toBeCalled(): R;
      
      /**
       * Ensures that a mock function is called an exact number of times.
       */
      toBeCalledTimes(times: number): R;
      
      /**
       * Ensures that a value is greater than another value.
       */
      toBeGreaterThan(expected: number): R;
    }
    
    interface ExpectExtendMap {
      [key: string]: (received: any, ...actual: any[]) => MatcherResult;
      toContain(item: unknown): R;
      toContainEqual(item: unknown): R;
      toHaveLength(length: number): R;
      toHaveProperty(propPath: string, value?: unknown): R;
      toMatchObject(object: unknown): R;
      toMatchSnapshot(propertyMatchers?: unknown, name?: string): R;
      toThrow(error?: unknown): R;
      toThrowError(error?: unknown): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledTimes(expected: number): R;
      toHaveBeenCalledWith(...args: unknown[]): R;
      toHaveBeenLastCalledWith(...args: unknown[]): R;
      toHaveBeenNthCalledWith(nthCall: number, ...args: unknown[]): R;
      toHaveReturned(): R;
      toHaveReturnedTimes(expected: number): R;
      toHaveReturnedWith(expected: unknown): R;
      toHaveLastReturnedWith(expected: unknown): R;
      toHaveNthReturnedWith(nthCall: number, expected: unknown): R;
      toStrictEqual(expected: unknown): R;
      toMatchInlineSnapshot(snapshot?: string): R;
      toThrowErrorMatchingSnapshot(): R;
      toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R;
      toHaveValue(value?: string | string[] | number | null): R;
      toHaveDisplayValue(value: string | string[] | RegExp | Array<RegExp | string>): R;
      toBeChecked(): R;
      toBePartiallyChecked(): R;
      toHaveErrorMessage(text: string | RegExp): R;
      
      // Additional matchers
      toBeCalled(): R;
      toBeCalledTimes(expected: number): R;
      toBeCalledWith(...args: unknown[]): R;
      lastCalledWith(...args: unknown[]): R;
    }
  }
}
