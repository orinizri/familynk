// client/.eslintrc.cjs
module.exports = {
  root: true,

  // 1) What environments your code runs in
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true, // Add this line to define the Node.js environment
  },
  globals: {
    process: "readonly",
  },
  // 2) Which base rulesets to extend
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:jest/recommended",
    "prettier"
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  // 3) Parser options for ES modules + JSX
  parserOptions: {
    ecmaVersion: "2020",
    sourceType: "module",
    project: "./tsconfig.json", // or tsconfig.server.json

    ecmaFeatures: {
      jsx: true,
    },
  },

  // 4) Plugin settings (so eslint-plugin-react can detect your React version)
  settings: {
    react: {
      version: "detect",
    },
  },

  // 5) Custom rules
  rules: {
    // allow unused args that start with _
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    // allow process.env in CRA
    "no-undef": [
      "error",
      { typeof: true }, // this lets process be used in env checks
    ],
    // disable PropTypes requirement until you add them or migrate to TS
    "react/prop-types": "off",
  },
  ignorePatterns: ["dist", "node_modules", "build"],
};
