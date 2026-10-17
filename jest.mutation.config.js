module.exports = {
  preset: 'jest-expo',
  testTimeout: 10000,
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/tests/core/**/*.test.ts',
    '**/tests/corpus.test.ts',
  ],
};
