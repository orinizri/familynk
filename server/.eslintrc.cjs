/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "../tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // basic rules
    "plugin:@typescript-eslint/recommended-requiring-type-checking", // rules that need type info
    "prettier",
  ],
  ignorePatterns: [".eslintrc.cjs", "dist", "build", "node_modules"],
  // rules: {
  //   "no-unused-vars": "off", // handled by TS
  //   "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  // },
  rules: {
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/no-unsafe-argument": "warn",
  },
};
