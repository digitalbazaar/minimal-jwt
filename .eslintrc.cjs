module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    Uint8Array: true
  },
  extends: [
    'digitalbazaar',
    'digitalbazaar/jsdoc',
    'digitalbazaar/module'
  ],
  ignorePatterns: ['node_modules/']
};
