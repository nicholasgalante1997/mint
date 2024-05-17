module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "standard-with-typescript",
        'eslint:recommended',
        "plugin:react/recommended",
        "plugin:prettier/recommended"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": "tsconfig.json"
    },
    "plugins": [
        "react",
        "eslint-plugin-react-compiler"
    ],
    "rules": {
        "@typescript-eslint/semi": "off",
        "@typescript-eslint/space-before-function-paren": "off",
        "@typescript-eslint/consistent-type-imports": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        'react-compiler/react-compiler': "error",
    },
    "ignorePatterns": ['./__tests__/**/*.{js,jsx,mjs,cjs,ts,tsx}', 'node_modules']
}
