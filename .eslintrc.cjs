/* eslint-env node */
module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-reserved-component-names': 'off',
    // https://standardjs.com/rules-ja.html
    'quotes': [ 'error', 'single', { 'avoidEscape': true } ],
    'keyword-spacing': ['error'],
    'space-before-function-paren': ['error', {
      'anonymous':'never',
      'named':'never',
      'asyncArrow': 'always'
    }],
    'block-spacing': ['error', 'always'],
    'key-spacing': ['error', {
      'beforeColon' : false,
      'afterColon' : true,
    }],
    'func-call-spacing': ['error', 'never'],
  }
}
