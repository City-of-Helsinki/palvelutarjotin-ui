module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  transform: {
    '.+\\.(css|styl|less|sass|scss)$':
      '<rootDir>/node_modules/jest-css-modules-transform',
    '^.+\\.tsx?$': 'ts-jest',
    'hds-react': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!hds-react)/'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // https://github.com/zeit/next.js/issues/8663#issue-490553899
  globals: {
    // we must specify a custom tsconfig for tests because we need the typescript transform
    // to transform jsx into js rather than leaving it jsx such as the next build requires. you
    // can see this setting in tsconfig.jest.json -> "jsx": "react"
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.jest.json',
    },
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/src/generated/graphql.tsx',
    '<rootDir>/src/pages/',
    '<rootDir>/src/server.js',
    '<rootDir>/src/start.js',
    '<rootDir>/src/domain/app/apollo/configureApollo.tsx',
    '<rootDir>/src/utils/testUtils.ts',
  ],
  collectCoverageFrom: ['src/**/*.{js,jsx,tsx}', '!src/**/*.stories.tsx'],
};
