module.exports = {
  testEnvironment: 'jest-fixed-jsdom',
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
    // Force uuid package to use CommonJS version instead of ESM.
    // Needed at least with hds-react v3.12.0 which uses export keyword in
    // hds-react/node_modules/uuid/dist/esm-browser/index.js
    // and otherwise fails with "SyntaxError: Unexpected token 'export'".
    uuid: require.resolve('uuid'),
  },
  modulePathIgnorePatterns: [
    // Ignore Next.js build output directory, so jest-haste-map does not
    // find haste module naming collisions between package.json files
    // when running tests.
    '\\.next/',
  ],
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
