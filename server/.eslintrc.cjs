module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    jest: true, // Enable Jest globals for testing
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
  overrides: [
    {
      files: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[jt]s?(x)",
        "**/?(*.)+(spec|test).js",
      ],
      env: { jest: true },
    },
  ],
};
