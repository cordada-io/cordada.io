module.exports = {
  plugins: ['prettier-plugin-tailwindcss', require.resolve('prettier-plugin-css-order')],
  tailwindConfig: './tailwind.config.js',
  tailwindFunctions: ['tw'],
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  cssDeclarationSorterOrder: 'alphabetical',
};
