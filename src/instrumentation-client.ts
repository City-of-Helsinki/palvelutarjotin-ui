import * as Sentry from '@sentry/nextjs';

import getEnvValue from './utils/getEnvValue';

if (getEnvValue('NEXT_PUBLIC_SENTRY_DSN')) {
  Sentry.init({
    dsn: getEnvValue('NEXT_PUBLIC_SENTRY_DSN'),
    environment: getEnvValue('NEXT_PUBLIC_SENTRY_ENVIRONMENT'),
    release: getEnvValue('NEXT_PUBLIC_SENTRY_RELEASE'),
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: parseFloat(
      getEnvValue('NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE') || '0'
    ),
    tracePropagationTargets: (
      getEnvValue('NEXT_PUBLIC_SENTRY_TRACE_PROPAGATION_TARGETS') ?? ''
    )
      .split(',')
      .map((target) => target.trim())
      .filter(Boolean),
    replaysSessionSampleRate: parseFloat(
      getEnvValue('NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE') || '0'
    ),
    replaysOnErrorSampleRate: parseFloat(
      getEnvValue('NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE') || '0'
    ),
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
