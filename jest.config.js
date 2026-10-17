module.exports = {
  preset: 'jest-expo',
  testTimeout: 20000,
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: ['./jest.app-after-env.js'],
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/tests/**/*.test.[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'src/core/**/*.ts',
    'src/lib/**/*.ts',
    '!src/core/domain/**',
  ],
  coverageThreshold: {
    './src/core/': {
      statements: 93,
      branches: 83,
      functions: 96,
      lines: 95,
    },
    './src/lib/': {
      statements: 70,
      branches: 55,
      functions: 80,
      lines: 72,
    },
  },
};
