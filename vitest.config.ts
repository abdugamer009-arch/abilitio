import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "node",
    // Release comparisons and private source snapshots under artifacts are not tests.
    include: ["tests/**/*.{test,spec}.{ts,tsx,js,jsx,mjs,cjs}"],
    globals: true,
    // Bound database/transform concurrency on developer machines.
    maxWorkers: 2,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
