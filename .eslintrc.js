const path = require('path');

module.exports = {
  extends: 'airbnb-base',
  parser: 'babel-eslint',
  env: {
    browser: true,
  },
  globals: {
    __IS_DEBUG: 'readonly',
  },
  rules: {
    'arrow-body-style': 'off',
    'consistent-return': 'off',
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
    }],
    'padded-blocks': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.js', '.json'],
        map: [
          ['common', path.resolve('src/common')],
          ['pages', path.resolve('src/pages')],
        ],
      },
    },
  },
};
