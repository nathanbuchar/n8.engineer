module.exports = {
  extends: 'airbnb-base',
  parser: 'babel-eslint',
  env: {
    browser: true,
  },
  rules: {
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
    }],
    'padded-blocks': 'off',
  },
};
