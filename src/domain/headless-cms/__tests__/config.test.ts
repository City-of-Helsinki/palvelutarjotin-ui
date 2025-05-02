import AppConfig from '../config';

describe('AppConfig', () => {
  // Store original environment to restore later
  const originalEnv = process.env;

  beforeEach(() => {
    // Clear cache and reset environment for each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('origin', () => {
    it.each([
      'http://localhost:3000',
      'https://kultus.hel.fi',
      'https://sub.example.com:1234/path',
    ])('should return the NEXT_PUBLIC_APP_ORIGIN value (%s)', (appOrigin) => {
      process.env.NEXT_PUBLIC_APP_ORIGIN = appOrigin;
      expect(AppConfig.origin).toStrictEqual(appOrigin);
    });

    it('should throw error when NEXT_PUBLIC_APP_ORIGIN is undefined', () => {
      delete process.env.NEXT_PUBLIC_APP_ORIGIN;
      expect(() => AppConfig.origin).toThrow(
        'Environment variable with name NEXT_PUBLIC_APP_ORIGIN was not found'
      );
    });

    it('should throw error when NEXT_PUBLIC_APP_ORIGIN is empty string', () => {
      process.env.NEXT_PUBLIC_APP_ORIGIN = '';
      expect(() => AppConfig.origin).toThrow(
        'Environment variable with name NEXT_PUBLIC_APP_ORIGIN was not found'
      );
    });
  });

  describe('hostname', () => {
    it.each([
      ['http://localhost:3000', 'localhost'],
      ['https://kultus.hel.fi', 'kultus.hel.fi'],
      ['https://sub.example.com:1234/path', 'sub.example.com'],
    ])('should extract hostname from %s as %s', (origin, expected) => {
      process.env.NEXT_PUBLIC_APP_ORIGIN = origin;
      expect(AppConfig.hostname).toStrictEqual(expected);
    });

    it('should throw error when creating URL from invalid origin', () => {
      process.env.NEXT_PUBLIC_APP_ORIGIN = 'invalid-url';
      expect(() => AppConfig.hostname).toThrow();
    });
  });
});
