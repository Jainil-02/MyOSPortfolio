import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    // Run files matching *.test.ts or *spec.ts
    // Exclude the test-poc.ts pattern since it's a main file, not a test file
    include: ['src/**/*.test.ts', 'test/**/*.ts'],
    exclude: ['node_modules', 'dist'],
  },
  // TypeScript path aliases if needed
  resolve: {
    alias: {
      // '@/' will be resolved to <root>/src
    },
  },
});