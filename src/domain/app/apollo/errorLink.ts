import type { ApolloLink, ServerError, ServerParseError } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import * as Sentry from '@sentry/nextjs';

import isClient from '../../../utils/isClient';

/** Identifies which GraphQL API an error came from. */
export type GraphQLClientName = 'kultus-api' | 'headless-cms';

type NetworkError = Error | ServerError | ServerParseError;

/**
 * Wraps the original network error, so that the Sentry issue title tells
 * which client and operation failed. The original error is kept as `cause`.
 */
export class GraphQLNetworkError extends Error {
  constructor(message: string, cause: NetworkError) {
    super(message);
    this.name = 'GraphQLNetworkError';
    // Set manually, because the TS target (es6) does not know the `cause` option.
    (this as { cause?: unknown }).cause = cause;
  }
}

/**
 * How long after `beforeunload` the page is considered to be leaving.
 * `beforeunload` also fires when the page does not actually leave
 * (e.g. a cancelled navigation or a `mailto:` link), so it must not
 * suppress the error reporting for the rest of the page's lifetime.
 */
export const BEFORE_UNLOAD_GRACE_PERIOD_MS = 5000;

let beforeUnloadAt: number | undefined;
let isPageHidden = false;
let isUnloadTrackingRegistered = false;

/**
 * Track whether the page is being left (e.g. a hard navigation or reload).
 * The browser cancels in-flight requests then, which surfaces as a generic
 * fetch failure ("Failed to fetch", "Load failed", ...) that is not a real error.
 *
 * - `beforeunload` marks the start of a possible navigation, for a short time.
 *   Requests can be cancelled before `pagehide` fires.
 * - `pagehide` marks that the page is actually being left.
 * - `pageshow` resets the state, e.g. when the page is restored from
 *   the back/forward cache.
 */
function registerUnloadTracking() {
  if (isUnloadTrackingRegistered || !isClient()) return;
  isUnloadTrackingRegistered = true;
  window.addEventListener('beforeunload', () => {
    beforeUnloadAt = Date.now();
  });
  window.addEventListener('pagehide', () => {
    isPageHidden = true;
  });
  window.addEventListener('pageshow', () => {
    beforeUnloadAt = undefined;
    isPageHidden = false;
  });
}

/**
 * Whether the page is being left, so failed requests are likely
 * cancelled by the browser.
 */
function isPageUnloading(): boolean {
  if (isPageHidden) return true;
  return (
    beforeUnloadAt !== undefined &&
    Date.now() - beforeUnloadAt < BEFORE_UNLOAD_GRACE_PERIOD_MS
  );
}

/** Reset the module state. NOTE: Only meant for unit tests. */
export function resetErrorLinkState() {
  beforeUnloadAt = undefined;
  isPageHidden = false;
  isUnloadTrackingRegistered = false;
}

/**
 * Returns the HTTP status code of a network error, if the API responded.
 *
 * @param networkError The network error from Apollo.
 * @returns The HTTP status code, or `undefined` if there was no response.
 */
export function getNetworkErrorStatusCode(
  networkError: NetworkError
): number | undefined {
  return 'statusCode' in networkError &&
    typeof networkError.statusCode === 'number'
    ? networkError.statusCode
    : undefined;
}

/**
 * Network errors that are caused by the browser or the user, not by the API.
 */
function isIgnorableNetworkError(networkError: NetworkError): boolean {
  // The request was cancelled on purpose (e.g. by an AbortController).
  if (networkError.name === 'AbortError') return true;
  // The API responded with an error status, so it is a real API error,
  // even if the page is unloading or the browser went offline meanwhile.
  if (getNetworkErrorStatusCode(networkError) !== undefined) return false;
  if (isClient()) {
    if (isPageUnloading()) return true;
    // The user is offline, there is nothing to fix on our side.
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return true;
    }
  }
  return false;
}

/**
 * Creates an Apollo error link that logs GraphQL and network errors
 * to the console and reports them to Sentry.
 *
 * @param clientName Name of the GraphQL API, added to the Sentry events as a tag.
 */
export function createErrorLink(clientName: GraphQLClientName): ApolloLink {
  registerUnloadTracking();

  return onError(({ graphQLErrors, networkError, operation }) => {
    const operationName = operation.operationName || 'unknown';

    if (graphQLErrors) {
      graphQLErrors.forEach((error) => {
        const { message, locations, path } = error;
        // NOTE: The message format is kept unchanged on purpose,
        // so that the existing Sentry issues keep their grouping.
        const errorMessage = `[GraphQL error]: ${JSON.stringify({
          OperationName: operation.operationName,
          Message: message,
          Location: locations,
          Path: path,
        })}`;
        // eslint-disable-next-line no-console
        console.error(errorMessage);
        Sentry.captureMessage(errorMessage, {
          tags: {
            'graphql.client': clientName,
            'graphql.operation': operationName,
          },
        });
      });
    }

    if (networkError) {
      const statusCode = getNetworkErrorStatusCode(networkError);
      // eslint-disable-next-line no-console
      console.error(
        `[GraphQL networkError]: ${JSON.stringify({
          Client: clientName,
          Operation: operationName,
          StatusCode: statusCode,
          Name: networkError.name,
          Message: networkError.message,
        })}`
      );

      if (isIgnorableNetworkError(networkError)) return;

      const reason = statusCode
        ? `HTTP ${statusCode}`
        : `${networkError.name}: ${networkError.message}`;

      Sentry.captureException(
        new GraphQLNetworkError(
          `[${clientName}] ${operationName} failed: ${reason}`,
          networkError
        ),
        {
          // An HTTP error status means the API responded with an error.
          // Without a status the request never got a response
          // (connection problem, CORS, blocked by an extension, ...).
          level: statusCode ? 'error' : 'warning',
          tags: {
            'graphql.client': clientName,
            'graphql.operation': operationName,
            'graphql.status_code': statusCode ? String(statusCode) : 'none',
          },
          // Group by client and status (or error type), not by operation,
          // so one API problem does not spread over many issues.
          fingerprint: [
            'graphql-network-error',
            clientName,
            statusCode ? String(statusCode) : networkError.name,
          ],
        }
      );
    }
  });
}
