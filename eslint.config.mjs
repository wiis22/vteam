import globals from "globals";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
        ignores: ["**/coverage/**"], // Ignore all files in the coverage folder
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: globals.browser,
        },
        plugins: {
            react: pluginReact,
        },
        rules: {
            semi: "error"// Add other rules here if needed
        },
        settings: {
            react: {
                version: "detect", // Automatically detect React version
            },
        },
    },
];
