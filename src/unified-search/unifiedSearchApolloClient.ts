import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import fetch from 'cross-fetch';
import { useMemo } from 'react';

import {
  initializeApolloClient,
  MutableReference,
} from '../common/apollo/utils';

const unifiedSearchApolloClient = new MutableReference<
  ApolloClient<NormalizedCacheObject>
>();

export const createUnifiedSearchApolloClient =
  (): ApolloClient<NormalizedCacheObject> => {
    return new ApolloClient({
      link: new HttpLink({
        uri: process.env.NEXT_PUBLIC_UNIFIED_SEARCH_BASE_URL,
        fetch,
      }),
      cache: new InMemoryCache(),
    });
  };

export default function initializeUnifiedSearchApollo(
  initialState: NormalizedCacheObject
): ApolloClient<NormalizedCacheObject> {
  return initializeApolloClient<
    NormalizedCacheObject,
    ApolloClient<NormalizedCacheObject>
  >({
    initialState,
    mutableCachedClient: unifiedSearchApolloClient,
    createClient: createUnifiedSearchApolloClient,
  });
}

export function useUnifiedSearchApolloClient(
  initialState: NormalizedCacheObject = {}
): ApolloClient<NormalizedCacheObject> {
  const store = useMemo(
    () => initializeUnifiedSearchApollo(initialState),
    [initialState]
  );

  return store;
}
