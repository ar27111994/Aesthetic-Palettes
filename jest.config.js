// Jest configuration
module.exports = {
  // Tell Jest to handle .ts and .tsx files with ts-jest
  preset: 'ts-jest/presets/default-esm',
  // Test environment
  testEnvironment: 'jsdom',
  
  // File extensions to test
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)'
  ],
  
  // Transform settings
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest'],
  },
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: 'tsconfig.jest.json',
    },
  },
  transformIgnorePatterns: [
    'node_modules/(?!(next|@babel/runtime|@babel/plugin-transform-runtime)/)',
  ],
  // Module file extensions to include
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  // Module name mapper for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Test environment
  testEnvironment: 'jsdom',
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(react-markdown|vfile|vfile-message|unist-util-stringify-position|unified|bail|is-plain-obj|trough|remark-parse|mdast-util-from-markdown|mdast-util-to-string|mdast-util-to-markdown|micromark-util-decode-numeric-character-reference|micromark-util-decode-string|micromark-util-normalize-identifier|micromark-util-encode|micromark-util-sanitize-uri|micromark-util-subtokenize|micromark-util-resolve-all|micromark-util-html-tag|micromark-util-chunked|micromark-util-classify-character|micromark-util-combine-extensions|micromark-util-decode-numeric-character-reference|micromark-util-decode-string|micromark-util-encode|micromark-util-normalize-identifier|micromark-util-sanitize-uri|micromark-util-subtokenize|micromark-util-resolve-all|micromark-util-html-tag|micromark-util-chunked|micromark-util-classify-character|micromark-util-combine-extensions|micromark-util-decode-numeric-character-reference|micromark-util-decode-string|micromark-util-encode|micromark-util-normalize-identifier|micromark-util-sanitize-uri|micromark-util-subtokenize|micromark-util-resolve-all|micromark-util-html-tag|micromark-util-chunked|micromark-util-classify-character|micromark-util-combine-extensions|micromark-util-decode-numeric-character-reference|micromark-util-decode-string|micromark-util-encode|micromark-util-normalize-identifier|micromark-util-sanitize-uri|micromark-util-subtokenize|micromark-util-resolve-all|micromark-util-html-tag|micromark-util-chunked|micromark-util-classify-character|micromark-util-combine-extensions|micromark-util-decode-numeric-character-reference|micromark-util-decode-string|micromark-util-encode|micromark-util-normalize-identifier|micromark-util-sanitize-uri|micromark-util-subtokenize|micromark-util-resolve-all|micromark-util-html-tag|micromark-util-chunked|micromark-util-classify-character|micromark-util-combine-extensions|micromark-util-decode-numeric-character-reference|micromark-util-decode-string|micromark-util-encode|micark-util-normalize-identifier|micromark-util-sanitize-uri|micromark-util-subtokenize|micromark-util-resolve-all|micromark-util-html-tag|micromark-util-chunked|micromark-util-classify-character|micromark-util-combine-extensions|micromark-util-decode-numeric-character-reference|micromark-util-decode-string|micromark-util-encode|micromark-util-normalize-identifier|micromark-util-sanitize-uri|micromark-util-subtokenize|micromark-util-resolve-all|micromark-util-html-tag|micromark-util-chunked|micromark-util-classify-character|micromark-util-combine-extensions)/)',
  ],
  
  // Module name mappers - must match tsconfig.json paths
  moduleNameMapper: {
    '^@public/(.*)$': '<rootDir>/public/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@i18n/(.*)$': '<rootDir>/src/i18n/$1',
    '^@components/(.*)$': '<rootDir>/src/app/components/$1',
    '^@styles/(.*)$': '<rootDir>/src/app/styles/$1',
    '^@palettes/(.*)$': '<rootDir>/src/app/palettes/$1',
    '^@context/(.*)$': '<rootDir>/src/lib/context/$1',
    '^@hooks/(.*)$': '<rootDir>/src/lib/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/src/lib/utils/$1',
    '^@typings/(.*)$': '<rootDir>/src/lib/typings/$1',
    '^@features/(.*)$': '<rootDir>/src/lib/features/$1',
    '^@tests/(.*)$': '<rootDir>/src/__tests__/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  
  // Setup files
  setupFiles: [
    '<rootDir>/src/__mocks__/globalMocks.ts',
    '<rootDir>/src/jest-setup.ts',
    'jest-canvas-mock'
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    '<rootDir>/src/setupTests.ts',
    '<rootDir>/jest.setup.js'
  ],
  
  // Module Directories
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  
  // Test timeout
  testTimeout: 10000,
  
  // Test coverage settings
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/index.{ts,tsx}',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  
  // Transform settings
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'babel-jest',
      {
        presets: [
          'next/babel',
          '@babel/preset-typescript',
          ['@babel/preset-react', { runtime: 'automatic' }]
        ],
        plugins: [
          '@babel/plugin-transform-class-properties',
          '@babel/plugin-transform-runtime',
        ]
      }
    ]
  },
  
  // Module path aliases
  moduleDirectories: ['node_modules', 'src'],
  
  // Test environment setup
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  
  // Watch plugins (temporarily disabled due to dependency issues)
  // watchPlugins: [
  //   'jest-watch-typeahead/filename',
  //   'jest-watch-typeahead/testname',
  // ],
  
  // Global test timeout (30 seconds)
  testTimeout: 30000,
  
  // Clear mock calls between tests
  clearMocks: true,
  
  // Reset modules between tests
  resetMocks: true,
  resetModules: true,
  
  // Restore mocks between tests
  restoreMocks: true,
  
  // Test results processor
  reporters: [
    'default',
    ['jest-junit', { 
      outputDirectory: 'test-results', 
      outputName: 'junit.xml' 
    }],
  ],
  
  // Test path ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/out/',
    '/public/',
  ],
  
  // Coverage threshold (lowered for development)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
