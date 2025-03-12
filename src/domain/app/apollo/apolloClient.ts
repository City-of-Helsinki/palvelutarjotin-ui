import {
  ApolloClient,
  HttpLink,
  NormalizedCacheObject,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import { useRef } from 'react';

import { createApolloCache } from './cache';
import { IS_CLIENT } from '../../../constants';
import type { CustomPageProps } from '../../../types';

let apolloClient: ApolloClient<NormalizedCacheObject>;

/**
 * Creates a new Apollo Client instance.
 *
 * This function sets up an Apollo Client with error handling, an HTTP link, and a custom cache.
 * It's used internally by `initializeApolloClient`.
 *
 * @returns A new Apollo Client instance.
 */
function createApolloClient(): ApolloClient<NormalizedCacheObject> {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        // eslint-disable-next-line no-console
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }
    if (networkError) {
      // eslint-disable-next-line no-console
      console.log(`[Network error]: ${networkError}`);
    }
  });
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_BASE_URL,
  });
  return new ApolloClient({
    ssrMode: !IS_CLIENT,
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
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });
    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }

  // For SSG and SSR always create a new Apollo Client
  if (!IS_CLIENT) {
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
 * [https://github.com/apollographql/next-apollo-example](https://github.com/apollographql/next-apollo-example)
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
