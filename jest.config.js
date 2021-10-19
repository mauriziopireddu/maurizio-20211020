module.exports = {
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  coveragePathIgnorePatterns: ["index.ts", "node_modules", ".next"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  moduleDirectories: ["node_modules", "<rootDir>/node_modules", "."],
  testEnvironment: "jsdom",
  clearMocks: true,
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 82,
      functions: 91,
      lines: 96,
    },
  },
};
