module.exports = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/src/__tests__/setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/__tests__/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(.*\\.mjs$))",
  ],
  testMatch: ["**/src/__tests__/**/*.test.{js,jsx}"],
  moduleFileExtensions: ["js", "jsx", "json"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/main.jsx",
    "!src/__tests__/**",
  ],
};