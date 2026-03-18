"use strict";

const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const jest = require("eslint-plugin-jest");
const unusedImports = require("eslint-plugin-unused-imports");

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts", "test/**/*.ts"],
    plugins: { jest, "unused-imports": unusedImports },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        jest: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  { ignores: ["node_modules/", "dist/", "coverage/", "libs/", "**/*.peg", "**/*.mjs", "**/*.cjs", "eslint.config.js"] }
);
