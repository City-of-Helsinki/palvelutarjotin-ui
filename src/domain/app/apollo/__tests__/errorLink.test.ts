import {
  ApolloLink,
  FetchResult,
  Observable,
  execute,
  gql,
} from '@apollo/client';
import * as Sentry from '@sentry/nextjs';
import { GraphQLError } from 'graphql';

import * as isClient from '../../../../utils/isClient';
import {
  BEFORE_UNLOAD_GRACE_PERIOD_MS,
  GraphQLNetworkError,
  createErrorLink,
  resetErrorLinkState,
} from '../errorLink';

jest.mock('../../../../utils/isClient', () => {
  return {
    __esModule: true,
    ...jest.requireActual('../../../../utils/isClient'),
  };
});

const query = gql`
  query TestOperation {
    field
  }
`;

const createServerError = (statusCode: number) =>
  Object.assign(new Error('Response not successful'), {
    name: 'ServerError',
    statusCode,
    response: {},
    result: {},
  });

/** Runs the operation through the error link and resolves when it settles. */
function run(terminatingLink: ApolloLink) {
  const link = ApolloLink.from([
    createErrorLink('kultus-api'),
    terminatingLink,
  ]);
  return new Promise<void>((resolve) => {
    execute(link, { query }).subscribe({
      next: () => undefined,
      error: () => resolve(),
      complete: () => resolve(),
    });
  });
}

const failWith = (error: Error) =>
  new ApolloLink(() => new Observable((observer) => observer.error(error)));

describe('createErrorLink', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(isClient, 'default').mockReturnValue(true);
    jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    resetErrorLinkState();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('reports an HTTP error as an exception with status code', async () => {
    await run(failWith(createServerError(502)));

    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
    const [error, hint] = (Sentry.captureException as jest.Mock).mock.calls[0];
    expect(error).toBeInstanceOf(GraphQLNetworkError);
    expect(error.message).toBe('[kultus-api] TestOperation failed: HTTP 502');
    expect(error.cause.statusCode).toBe(502);
    expect(hint).toEqual({
      level: 'error',
      tags: {
        'graphql.client': 'kultus-api',
        'graphql.operation': 'TestOperation',
        'graphql.status_code': '502',
      },
      fingerprint: ['graphql-network-error', 'kultus-api', '502'],
    });
  });

  it('reports a failed fetch without status code as a warning', async () => {
    await run(failWith(new TypeError('Failed to fetch')));

    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
    const [error, hint] = (Sentry.captureException as jest.Mock).mock.calls[0];
    expect(error.message).toBe(
      '[kultus-api] TestOperation failed: TypeError: Failed to fetch'
    );
    expect(hint.level).toBe('warning');
    expect(hint.tags['graphql.status_code']).toBe('none');
    expect(hint.fingerprint).toEqual([
      'graphql-network-error',
      'kultus-api',
      'TypeError',
    ]);
  });

  it('logs the network error details to the console', async () => {
    await run(failWith(new TypeError('Failed to fetch')));

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith(
      `[GraphQL networkError]: ${JSON.stringify({
        Client: 'kultus-api',
        Operation: 'TestOperation',
        Name: 'TypeError',
        Message: 'Failed to fetch',
      })}`
    );
  });

  it('does not report aborted requests', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';

    await run(failWith(abortError));

    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('does not report network errors while the user is offline', async () => {
    jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);

    await run(failWith(new TypeError('Failed to fetch')));

    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('does not report network errors after the page is hidden', async () => {
    const failedFetch = failWith(new TypeError('Failed to fetch'));
    await run(failedFetch); // registers the page lifecycle listeners
    expect(Sentry.captureException).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new Event('pagehide'));
    await run(failedFetch);
    expect(Sentry.captureException).toHaveBeenCalledTimes(1);

    // Restored from the back/forward cache: errors are reported again.
    window.dispatchEvent(new Event('pageshow'));
    await run(failedFetch);
    expect(Sentry.captureException).toHaveBeenCalledTimes(2);
  });

  it('does not report network errors shortly after beforeunload', async () => {
    const now = 1_000_000;
    const dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(now);
    const failedFetch = failWith(new TypeError('Failed to fetch'));
    await run(failedFetch); // registers the page lifecycle listeners
    expect(Sentry.captureException).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new Event('beforeunload'));
    dateNowSpy.mockReturnValue(now + BEFORE_UNLOAD_GRACE_PERIOD_MS - 1);
    await run(failedFetch);
    expect(Sentry.captureException).toHaveBeenCalledTimes(1);

    // The page did not leave (e.g. a cancelled navigation or a mailto link),
    // so errors are reported again after the grace period.
    dateNowSpy.mockReturnValue(now + BEFORE_UNLOAD_GRACE_PERIOD_MS);
    await run(failedFetch);
    expect(Sentry.captureException).toHaveBeenCalledTimes(2);
  });

  it('reports HTTP errors even while the user is offline', async () => {
    jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);

    await run(failWith(createServerError(502)));

    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
  });

  it('reports HTTP errors even while the page is unloading', async () => {
    const link = ApolloLink.from([
      createErrorLink('kultus-api'),
      failWith(createServerError(502)),
    ]);
    window.dispatchEvent(new Event('beforeunload'));
    window.dispatchEvent(new Event('pagehide'));

    await new Promise<void>((resolve) => {
      execute(link, { query }).subscribe({ error: () => resolve() });
    });

    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
  });

  it('reports GraphQL errors as messages with tags', async () => {
    await run(
      new ApolloLink(
        () =>
          new Observable<FetchResult>((observer) => {
            observer.next({
              errors: [
                new GraphQLError('Something went wrong', {
                  path: ['field'],
                }),
              ],
            });
            observer.complete();
          })
      )
    );

    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      '[GraphQL error]: {"OperationName":"TestOperation","Message":"Something went wrong","Path":["field"]}',
      {
        tags: {
          'graphql.client': 'kultus-api',
          'graphql.operation': 'TestOperation',
        },
      }
    );
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });
});
