/* global jest */
module.exports = {
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  withSentryConfig: jest.fn((config) => config),
};
