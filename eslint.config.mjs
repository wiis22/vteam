import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import babelParser from "@babel/eslint-parser";

export default [
    {
        files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
        ignores: ["**/coverage/**"], // Ignore all files in the coverage folder
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            parser: babelParser, // Ensure it's resolved properly
            parserOptions: {
                ecmaFeatures: {
                    jsx: false, // Fix typo: `jsx` instead of `js`
                },
                requireConfigFile: false,
            },
            globals: globals.browser,
        },
        plugins: {
            react: pluginReact,
            reactHooks: pluginReactHooks,
        },
        rules: {
            semi: "error",
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off"
        },
        settings: {
            react: {
                version: "detect", // Automatically detect React version
            },
        },
    },
    {
        files: ["frontend/webapp/**/*.js"],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                babelOptions: {
                    presets: ["@babel/preset-react"],
                },
            },
        }
    }
];

