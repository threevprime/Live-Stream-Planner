import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";

const browserGlobals = {
    window: "readonly",
    document: "readonly",
    navigator: "readonly",
    fetch: "readonly",
    setTimeout: "readonly",
    clearTimeout: "readonly",
    setInterval: "readonly",
    clearInterval: "readonly",
    console: "readonly",
    crypto: "readonly",
    URL: "readonly",
    URLSearchParams: "readonly",
    Response: "readonly",
    Request: "readonly",
    Headers: "readonly",
    FormData: "readonly",
    Intl: "readonly",
    React: "readonly",
};

const bunGlobals = {
    Bun: "readonly",
    console: "readonly",
    crypto: "readonly",
    URL: "readonly",
    Response: "readonly",
    Request: "readonly",
    Headers: "readonly",
};

export default [
    js.configs.recommended,
    prettier,
    {
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: true },
            },
            globals: browserGlobals,
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            react: reactPlugin,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            // setState in an effect is valid for initializing from async-loaded data
            "react-hooks/set-state-in-effect": "off",
            "no-console": "off",
        },
        settings: {
            react: { version: "detect" },
        },
    },
    {
        files: ["server/**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
            globals: bunGlobals,
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "no-console": "off",
        },
    },
];
