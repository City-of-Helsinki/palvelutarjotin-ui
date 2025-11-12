import {
  ApolloClient,
  HttpLink,
  NormalizedCacheObject,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import * as Sentry from '@sentry/nextjs';
import fetch from 'cross-fetch';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import { useRef } from 'react';

import { createApolloCache } from './cache';
import type { CustomPageProps } from '../../../types';
import isClient from '../../../utils/isClient';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

/**
 * Creates a new Apollo Client instance.
 *
 * This function sets up an Apollo Client with error handling, an HTTP link, and a custom cache.
 * It's used internally by `initializeApolloClient`.
 *
 * @returns A new Apollo Client instance.
 */
function createApolloClient(): ApolloClient<NormalizedCacheObject> {
  const errorLink = onError(
    // TODO: Log more informative errors by using `response` object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    uri: process.env.NEXT_PUBLIC_API_BASE_URL,
    fetch,
  });
  return new ApolloClient({
    ssrMode: !isClient(),
    link: from([errorLink, httpLink]),
    cache: createApolloCache(),
  });
}

/**
 * Initializes and returns an Apollo Client instance.
 *
 * This function creates or reuses an Apollo Client instance, hydrating it with the provided
 * `initialState` if available. It handles both server-side and client-side initialization.
 *
 * @param initialState Optional initial cache state to hydrate the Apollo Client.
 * @returns An Apollo Client instance.
 */
export function initializeApolloClient(
  initialState: NormalizedCacheObject | null = null
): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient();

  // Initial state hydration
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the initialState from getStaticProps/getServerSideProps
    // in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (existingArray, newArray) => {
        const mergedArray = [...existingArray]; // Start with existingArray

        for (const newItem of newArray) {
          if (!existingArray.some((destItem) => isEqual(newItem, destItem))) {
            mergedArray.push(newItem); // Append unique source items
          }
        }

        return mergedArray;
      },
    });
    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }

  // For SSG and SSR always create a new Apollo Client
  if (!isClient()) {
    return _apolloClient;
  }

  // Create the Apollo Client once in the client
  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
}

/**
 * Transfers Apollo Client cache state from server-side rendering (SSR) to the client.
 *
 * This function extracts the Apollo Client's cache and adds it to the `pageProps` object
 * under the `initialApolloState` key. This allows the client-side Apollo Client to
 * initialize its cache with the data fetched during SSR, preventing unnecessary re-fetching.
 *
 * @param client The Apollo Client instance used during server-side rendering.
 * @param pageProps The page props object, typically obtained from `getServerSideProps` or `getStaticProps`.
 * @returns The modified `pageProps` object with the Apollo Client cache state added.
 *
 * @example
 * ```typescript
 * import { initializeApollo, AllTrailsQuery } from './apollo'; // Replace with your actual Apollo setup
 * import { addApolloState } from './your-module'; // Replace with the actual file path
 *
 * export async function getServerSideProps() {
 * const apolloClient = initializeApollo();
 *
 * await apolloClient.query({
 * query: AllTrailsQuery,
 * });
 *
 * return addApolloState(apolloClient, {
 * props: {}, // Your existing page props
 * });
 * }
 * ```
 *
 * **Important:**
 *
 * - Ensure that your client-side Apollo Client is configured to use the `initialApolloState`
 * from `pageProps` to initialize its cache.
 * - This function assumes that `pageProps` is an object and modifies it in place.
 * - Consider adding type definitions for `CustomPageProps` to improve type safety.
 *
 * **Further Reading:**
 *
 * - For a detailed example and best practices, refer to the official Next.js Apollo example:
 * https://github.com/apollographql/next-apollo-example
 */
export function addApolloState<Props extends CustomPageProps>(
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: { props: Props }
) {
  if (pageProps) {
    pageProps.props.initialApolloState = client.cache.extract();
  }
  return pageProps;
}

/**
 * Provides an Apollo Client instance for use within React components.
 *
 * This hook initializes or reuses an Apollo Client instance and ensures it persists
 * across re-renders. It's designed to be used in client-side components.
 *
 * @param options Optional object containing `initialApolloState` for cache hydration.
 * @returns An Apollo Client instance.
 */
export function useApolloClient(
  {
    initialApolloState,
  }:
    | {
        initialApolloState: NormalizedCacheObject | null;
      }
    | undefined = { initialApolloState: null }
): ApolloClient<NormalizedCacheObject> {
  const storeRef = useRef<ApolloClient<NormalizedCacheObject>>();
  if (!storeRef.current) {
    storeRef.current = initializeApolloClient(initialApolloState);
  }
  return storeRef.current;
}

/**
 * Reset the global variable for Apollo Client.
 * NOTE: Helps in unit tests when running multipel tests simultaneously.
 */
export function resetApolloClient() {
  apolloClient = undefined;
}
