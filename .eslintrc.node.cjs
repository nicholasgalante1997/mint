module.exports = {
    "env": {
        "node": true
    },
    "extends": [
        'eslint:recommended',
        "plugin:react/recommended",
        "plugin:prettier/recommended"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
    },
    "plugins": [
        "react"
    ],
    "rules": {
    },
    "ignorePatterns": ['./__tests__/**/*.{js,jsx,mjs,cjs,ts,tsx}', 'node_modules']
}
