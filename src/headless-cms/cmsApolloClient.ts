/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { useMemo } from 'react';

let cmsApolloClient: ApolloClient<NormalizedCacheObject>;

const initializeCmsApolloClient = (
  initialState: NormalizedCacheObject | null
): ApolloClient<NormalizedCacheObject> => {
  const _apolloClient = cmsApolloClient ?? createCmsApolloClient();

  // Initial state hydration
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') {
    return _apolloClient;
  }

  // Create the Apollo Client once in the client
  if (!cmsApolloClient) {
    cmsApolloClient = _apolloClient;
  }

  return _apolloClient;
};

export const createCmsApolloClient =
  (): ApolloClient<NormalizedCacheObject> => {
    return new ApolloClient({
      uri: process.env.NEXT_PUBLIC_CMS_BASE_URL,
      cache: new InMemoryCache(),
    });
  };

export default function initializeCmsApollo(
  initialState: NormalizedCacheObject | null
): ApolloClient<NormalizedCacheObject> {
  return initializeCmsApolloClient(initialState);
}

export function useCmsApollo(
  initialState: NormalizedCacheObject | null = null
): ApolloClient<NormalizedCacheObject> {
  const store = useMemo(
    () => initializeCmsApollo(initialState),
    [initialState]
  );

  return store;
}
