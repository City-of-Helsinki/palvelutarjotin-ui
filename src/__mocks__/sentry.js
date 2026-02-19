/* global jest */
module.exports = {
  captureException: jest.fn(),
  withSentryConfig: jest.fn((config) => config),
};
