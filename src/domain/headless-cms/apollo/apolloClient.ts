import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import * as Sentry from '@sentry/browser';
import fetch from 'cross-fetch';
import merge from 'lodash/merge';
import { useRef } from 'react';

import { createCMSApolloCache } from './cache';
import type { CustomPageProps } from '../../../types';
import isClient from '../../../utils/isClient';
import AppConfig from '../config';
import { rewriteInternalURLs } from '../utils';

let cmsApolloClient: ApolloClient<NormalizedCacheObject> | undefined;

/**
 * Creates a new Apollo Client instance specifically for CMS data.
 *
 * This function sets up an Apollo Client configured to fetch data from the CMS GraphQL endpoint.
 * It includes a custom Apollo Link to rewrite internal URLs and uses a custom cache.
 *
 * @returns A new Apollo Client instance for CMS data.
 */
function createCmsApolloClient(): ApolloClient<NormalizedCacheObject> {
  // Rewrite the URLs coming from events API to route them internally.
  const transformInternalURLs = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      response.data = response.data
        ? rewriteInternalURLs(response.data)
        : response.data;
      return response;
    });
  });

  const errorLink = onError(
    ({ graphQLErrors, networkError, operation, response }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach((error) => {
          const { message, locations, path } = error;
          const errorMessage = `[GraphQL error]: ${JSON.stringify({
            OperationName: operation.operationName,
            Message: message,
            Location: locations,
            Path: path,
            // Response: response,
          })}`;
          // eslint-disable-next-line no-console
          console.error(errorMessage);
          Sentry.captureMessage(errorMessage);
        });
      }

      if (networkError) {
        // eslint-disable-next-line no-console
        console.error(
          `[GraphQL networkError]: ${JSON.stringify({
            Operation: operation.operationName,
            NetworkError: networkError,
          })}`
        );
        Sentry.captureMessage('Graphql Network error');
      }
    }
  );

  const httpLink = new HttpLink({
    uri: AppConfig.cmsGraphqlEndpoint,
    fetch,
  });

  return new ApolloClient({
    ssrMode: !isClient(),
    connectToDevTools: true,
    link: ApolloLink.from([errorLink, transformInternalURLs, httpLink]),
    cache: createCMSApolloCache(),
  });
}

/**
 * Initializes and returns an Apollo Client instance for CMS data.
 *
 * This function creates or reuses an Apollo Client instance for CMS data, hydrating it with the provided
 * `initialState` if available. It handles both server-side and client-side initialization.
 *
 * @param initialState Optional initial cache state to hydrate the CMS Apollo Client.
 * @returns An Apollo Client instance for CMS data.
 */
export function initializeCMSApolloClient(
  initialState: NormalizedCacheObject | null = null
): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = cmsApolloClient ?? createCmsApolloClient();

  // Initial state hydration
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore(merge(existingCache, initialState));
  }

  // For SSG and SSR always create a new Apollo Client
  if (!isClient()) {
    return _apolloClient;
  }

  // Create the Apollo Client once in the client
  if (!cmsApolloClient) {
    cmsApolloClient = _apolloClient;
  }

  return _apolloClient;
}

/**
 * Transfers Apollo Client cache state from server-side rendering (SSR) to the client.
 *
 * This function extracts the Apollo Client's cache and adds it to the `pageProps` object
 * under the `initialCMSApolloState` key. This allows the client-side Apollo Client to
 * initialize its cache with the data fetched during SSR, preventing unnecessary re-fetching.
 *
 * @param client The Apollo Client instance used during server-side rendering.
 * @param pageProps The page props object, typically obtained from `getServerSideProps` or `getStaticProps`.
 * @returns The modified `pageProps` object with the Apollo Client cache state added.
 *
 * @example
 * ```typescript
 * import { initializeApollo, AllTrailsQuery } from './apollo'; // Replace with your actual Apollo setup
 * import { addCmsApolloState } from './your-module'; // Replace with the actual file path
 *
 * export async function getServerSideProps() {
 * const apolloClient = initializeApollo();
 *
 * await apolloClient.query({
 * query: AllTrailsQuery,
 * });
 *
 * return addCmsApolloState(apolloClient, {
 * props: {}, // Your existing page props
 * });
 * }
 * ```
 *
 * **Important:**
 *
 * - Ensure that your client-side Apollo Client is configured to use the `initialCMSApolloState`
 * from `pageProps` to initialize its cache.
 * - This function assumes that `pageProps` is an object and modifies it in place.
 * - Consider adding type definitions for `CustomPageProps` to improve type safety.
 *
 * **Further Reading:**
 *
 * - For a detailed example and best practices, refer to the official Next.js Apollo example:
 * https://github.com/apollographql/next-apollo-example
 */
export function addCmsApolloState<Props extends CustomPageProps>(
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: { props: Props }
) {
  if (pageProps) {
    pageProps.props.initialCMSApolloState = client.cache.extract();
  }
  return pageProps;
}

/**
 * Provides a CMS Apollo Client instance for use within React components.
 *
 * This hook initializes or reuses a CMS Apollo Client instance and ensures it persists
 * across re-renders. It's designed to be used in client-side components.
 *
 * @param options Optional object containing `initialCMSApolloState` for cache hydration.
 * @returns A CMS Apollo Client instance.
 */
export function useCMSApolloClient(
  {
    initialCMSApolloState,
  }:
    | {
        initialCMSApolloState: NormalizedCacheObject | null;
      }
    | undefined = { initialCMSApolloState: null }
): ApolloClient<NormalizedCacheObject> {
  const storeRef = useRef<ApolloClient<NormalizedCacheObject>>();
  if (!storeRef.current) {
    storeRef.current = initializeCMSApolloClient(initialCMSApolloState);
  }
  return storeRef.current;
}

/**
 * Reset the global variable for Apollo Client.
 * NOTE: Helps in unit tests when running multipel tests simultaneously.
 */
export function resetApolloClient() {
  cmsApolloClient = undefined;
}
