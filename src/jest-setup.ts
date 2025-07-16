// Import Jest's expect function to ensure we're using Jest's types
import { expect } from '@jest/globals';

// Make expect available globally
// @ts-ignore - We want to override the global expect
global.expect = expect;
