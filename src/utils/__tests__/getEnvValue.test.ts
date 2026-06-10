import getEnvValue from '../getEnvValue';

describe('getEnvValue', () => {
  const TEST_KEY = 'TEST_ENV_UTILS_VALUE';
  const originalRuntimeEnv = window._env_;
  const originalProcessValue = process.env[TEST_KEY];

  afterEach(() => {
    window._env_ = originalRuntimeEnv;

    if (originalProcessValue === undefined) {
      delete process.env[TEST_KEY];
    } else {
      process.env[TEST_KEY] = originalProcessValue;
    }

    jest.restoreAllMocks();
  });

  it.each([
    [123, '123'],
    [true, 'true'],
    ['test-value', 'test-value'],
  ])('coerces runtime value %p to string %p', (input, expected) => {
    window._env_ = {
      [TEST_KEY]: input,
    };

    expect(getEnvValue(TEST_KEY)).toBe(expected);
  });

  it('skips runtime object value and falls back to process.env', () => {
    window._env_ = {
      [TEST_KEY]: { nested: true },
    };
    process.env[TEST_KEY] = 'from-process-env';

    expect(getEnvValue(TEST_KEY)).toBe('from-process-env');
  });

  it('falls back to process.env when runtime key is missing', () => {
    window._env_ = {};
    process.env[TEST_KEY] = 'from-process-env';

    expect(getEnvValue(TEST_KEY)).toBe('from-process-env');
  });

  it('returns undefined when key is missing from all sources', () => {
    window._env_ = {};
    delete process.env[TEST_KEY];

    expect(getEnvValue(TEST_KEY)).toBeUndefined();
  });

  it('warns once when window._env_ is undefined', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {
      return;
    });

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const getEnvValueIsolated = require('../getEnvValue').default;

      window._env_ = undefined;

      getEnvValueIsolated(TEST_KEY);
      getEnvValueIsolated(TEST_KEY);
    });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      'Warning: window._env_ is undefined. The env-config.js script may not have loaded successfully.'
    );
  });
});
