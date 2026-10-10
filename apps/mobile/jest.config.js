/* global __dirname */
/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  displayName: 'mobile',
  rootDir: __dirname,
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@recipereel/api-types$': '<rootDir>/../../packages/api-types/src/index.ts',
    '^react-native-svg$': '<rootDir>/__mocks__/react-native-svg.ts',
  },
  setupFiles: ['<rootDir>/test/setup-env.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|lucide-react-native|react-native-reanimated|react-native-gesture-handler)',
  ],
};
