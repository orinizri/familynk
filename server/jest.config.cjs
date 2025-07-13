// server/jest.config.cjs
module.exports = {
  testEnvironment: "node",
  // Treat .js files as ESM
  extensionsToTreatAsEsm: [".jsx"],

  // No transform; we don’t need Babel if Node supports your syntax already
  transform: {},

  // Enable Jest’s ESM support
  // experimentalVMModules: true,

  // Match test files as .test.js or .spec.js under __tests__
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],

  // Collect coverage from your source files
  collectCoverageFrom: ["src/**/*.ts"],
};
