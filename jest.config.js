module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      { configFile: './babel.config.test.json' },
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
  globals: {
    'ts-jest': {
      diagnostics: true,
      tsconfig: './tsconfig.jest.json',
    },
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '/__mocks__/',
  ],
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
