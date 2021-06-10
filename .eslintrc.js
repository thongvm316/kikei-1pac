// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 6
  },
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    // 'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  // required to lint *.vue files
  plugins: ['vue', 'prettier'],
  ignorePatterns: ['src/test/'],
  rules: {
    'vue/no-multiple-template-root': 'off',
    'vue/no-unused-vars': 'error',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', // allow debugger during development
    indent: [
      'error',
      2,
      {
        ignoredNodes: ['TemplateLiteral'],
        SwitchCase: 1
      }
    ],
    // 'template-curly-spacing': 'off',
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'no-multiple-empty-lines': [2, { max: 1, maxBOF: 0 }]
  }
}
