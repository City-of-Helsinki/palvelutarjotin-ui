import * as Sentry from '@sentry/nextjs';

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: parseFloat(
      process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || '0'
    ),
    tracePropagationTargets: (
      process.env.NEXT_PUBLIC_SENTRY_TRACE_PROPAGATION_TARGETS || ''
    ).split(','),
    replaysSessionSampleRate: parseFloat(
      process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE || '0'
    ),
    replaysOnErrorSampleRate: parseFloat(
      process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE || '0'
    ),
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
