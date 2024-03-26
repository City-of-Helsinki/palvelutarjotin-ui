module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '.*\\.(tsx?)$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2021',
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  transformIgnorePatterns: [
    // '/node_modules/',
    'node_modules/(?!(react-helsinki-headless-cms|react-helsinki-headless-cms/apollo))/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '/__mocks__/',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/generated/',
    '<rootDir>/src/pages/',
    '<rootDir>/src/domain/app/apollo/configureApollo.tsx',
    '<rootDir>/src/utils/testUtils.ts',
  ],
  collectCoverageFrom: ['src/**/*.{js,jsx,tsx}'],
  testTimeout: 20000,
};
