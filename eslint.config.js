const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  // Ignorar todo el proyecto excepto services/proccess.js
  {
    ignores: ['**/*.js', '!services/proccess.js'],
  },
  {
    files: ['services/proccess.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
  },
];
