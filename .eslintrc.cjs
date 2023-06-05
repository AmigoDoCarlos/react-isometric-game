module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["/dist/**", "/src/serviceWorkers/**"],
  root: true,
  env: {
    node: true,
  },
};
