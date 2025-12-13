import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores(['dist', 'node_modules', 'build', '*.config.js']),
    {
        files: ['**/*.{js,jsx}'],
        extends: [
            js.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        rules: {
            // Ignore unused vars that start with underscore or are uppercase constants
            'no-unused-vars': [
                'error',
                {
                    varsIgnorePattern: '^_|^[A-Z_]+$',
                    argsIgnorePattern: '^_',
                    ignoreRestSiblings: true
                }
            ],

            // Allow console.warn and console.error in development
            'no-console': ['warn', { allow: ['warn', 'error'] }],

            // Disable prop-types since we're not using TypeScript or PropTypes
            'react/prop-types': 'off',

            // React Refresh - only warn instead of error for better DX
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },
])