function toEnvString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return value.toString();
  }

  return undefined;
}

let warnedAboutMissingEnv = false;

export default function getEnvValue(key: string): string | undefined {
  if (globalThis.window !== undefined) {
    // Detect if env-config.js failed to load.
    if (globalThis.window._env_ === undefined && !warnedAboutMissingEnv) {
      // eslint-disable-next-line no-console
      console.warn(
        'Warning: window._env_ is undefined. The env-config.js script may not have loaded successfully.'
      );
      warnedAboutMissingEnv = true;
    }

    const runtimeEnvValue = toEnvString(globalThis.window._env_?.[key]);

    if (runtimeEnvValue !== undefined) {
      return runtimeEnvValue;
    }
  }

  if (typeof process !== 'undefined') {
    const processValue = process.env?.[key];

    if (processValue !== undefined) {
      return processValue;
    }
  }

  return undefined;
}
