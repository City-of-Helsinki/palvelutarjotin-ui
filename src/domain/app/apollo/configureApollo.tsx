import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import withApollo from 'next-with-apollo';

import { IS_CLIENT } from '../../../constants';
let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const createApolloClient = (
  initialState: NormalizedCacheObject = {}
): ApolloClient<NormalizedCacheObject> => {
  const httpLink = new HttpLink({
    uri: process.env.API_BASE_URL,
  });

  const cache = new InMemoryCache().restore(initialState || {});

  return new ApolloClient({
    ssrMode: !IS_CLIENT, // Disables forceFetch on the server (so queries are only run once)
    // TODO: Add error link after adding Sentry to the project
    link: ApolloLink.from([httpLink]),
    cache,
  });
};

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 */
const initApolloClient = (
  initialState?: NormalizedCacheObject
): ApolloClient<NormalizedCacheObject> => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!IS_CLIENT) {
    return createApolloClient(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState);
  }

  return apolloClient;
};

export default withApollo(({ initialState }) => {
  return initApolloClient(initialState);
});

export { apolloClient };
