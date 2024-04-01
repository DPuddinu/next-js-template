/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-organize-imports"],
  singleQuote: true,
  printWidth: 120,
  bracketSameLine: true,
  htmlWhitespaceSensitivity: "ignore",
  trailingComma: "none",
};

export default config;
