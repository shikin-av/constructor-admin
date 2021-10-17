module.exports = {
  root: true,
  env: {
    es2017: true,
    node: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'google',
    'plugin:react/recommended',
  ],
  rules: {
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'indent': ['error', 2],
    'object-curly-spacing': ['off'],
    'no-trailing-spaces': ['off'],
    'padded-blocks': ['off'],
    'max-len': ['error', { 'code': 130 }],
    'arrow-parens': ['off'],
    'require-jsdoc': 0,
  },
  parserOptions: {
    'sourceType': 'module',
  },
  parser: 'babel-eslint',
}
