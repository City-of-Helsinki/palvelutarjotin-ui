// Fix the timezone to avoid issues with date/time tests
process.env.TZ = 'Europe/Helsinki';

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
    'node_modules/(?!(@city-of-helsinki/react-helsinki-headless-cms|@city-of-helsinki/react-helsinki-headless-cms/apollo))/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    // Force uuid package to use CommonJS version instead of ESM.
    // Needed at least with hds-react v3.12.0 which uses export keyword in
    // hds-react/node_modules/uuid/dist/esm-browser/index.js
    // and otherwise fails with "SyntaxError: Unexpected token 'export'".
    uuid: require.resolve('uuid'),
    // Mock Sentry - this will automatically use the manual mock
    '^@sentry/nextjs$': '<rootDir>/src/__mocks__/sentry.js',
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
    '<rootDir>/src/playwright/',
    '/__mocks__/',
  ],
  coveragePathIgnorePatterns: [
    '.d.ts',
    '.json',
    '.xml',
    '.yaml',
    '.md',
    '.html',
    '.css',
    '.properties',
    'node_modules/',
    'browser-tests/',
    'build/',
    '<rootDir>/src/tests',
    'codegen.ts',
    '<rootDir>/src/index.tsx',
    '<rootDir>/src/serviceWorker.ts',
    'public/mockServiceWorker.js',
    '<rootDir>/src/setupTests.ts',
    'query.ts',
    'Query.ts',
    'Query.tsx',
    'Queries.ts',
    'mutation.ts',
    'Mutation.ts',
    'Mutation.tsx',
    'mutations.ts',
    'Mutations.ts',
    'mutations/',
    'queries/',
    '<rootDir>/src/generated/',
    '<rootDir>/src/domain/app/apollo/configureApollo.tsx',
    '<rootDir>/src/utils/testUtils.tsx',
  ],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  testTimeout: 20000,
};
