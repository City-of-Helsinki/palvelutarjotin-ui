module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // https://github.com/zeit/next.js/issues/8663#issue-490553899
  globals: {
    // we must specify a custom tsconfig for tests because we need the typescript transform
    // to transform jsx into js rather than leaving it jsx such as the next build requires. you
    // can see this setting in tsconfig.jest.json -> "jsx": "react"
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.jest.json',
    },
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/src/generated/',
    '<rootDir>/src/pages/',
    '<rootDir>/src/server.mjs',
    '<rootDir>/src/start.mjs',
    '<rootDir>/src/domain/app/apollo/configureApollo.tsx',
    '<rootDir>/src/utils/testUtils.ts',
  ],
  collectCoverageFrom: ['src/**/*.{js,jsx,tsx}'],
};
