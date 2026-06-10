import * as Sentry from '@sentry/nextjs';

import getEnvValue from './src/utils/getEnvValue';

if (getEnvValue('NEXT_PUBLIC_SENTRY_DSN')) {
  Sentry.init({
    dsn: getEnvValue('NEXT_PUBLIC_SENTRY_DSN'),
    environment: getEnvValue('NEXT_PUBLIC_SENTRY_ENVIRONMENT'),
    release: getEnvValue('NEXT_PUBLIC_SENTRY_RELEASE'),
    tracesSampleRate: parseFloat(
      getEnvValue('NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE') || '0'
    ),
  });
}
