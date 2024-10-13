module.exports = {
  semi: true,
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'ignore',
  overrides: [
    {
      files: ['**/*.css', '**/*.scss', '**/*.html', '**/*.hbs'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
