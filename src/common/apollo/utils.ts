import { NormalizedCacheObject, ApolloClient } from '@apollo/client';

export class MutableReference<Ref = unknown> {
  _value?: Ref;

  constructor(initialReference?: Ref) {
    this._value = initialReference;
  }

  get reference(): Ref | undefined {
    return this._value;
  }

  set reference(ref: Ref | undefined) {
    this._value = ref;
  }
}

type InitApolloClientConfig<
  TCacheShape,
  Client extends ApolloClient<TCacheShape>,
> = {
  initialState: TCacheShape;
  mutableCachedClient: MutableReference<Client>;
  createClient: () => Client;
};

// https://www.apollographql.com/blog/building-a-next-js-app-with-apollo-client-slash-graphql/
export function initializeApolloClient<
  TCacheShape = NormalizedCacheObject,
  Client extends ApolloClient<TCacheShape> = ApolloClient<TCacheShape>,
>({
  initialState,
  mutableCachedClient,
  createClient,
}: InitApolloClientConfig<TCacheShape, Client>): ApolloClient<TCacheShape> {
  const _apolloClient = mutableCachedClient.reference ?? createClient();

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
  if (!mutableCachedClient.reference) {
    mutableCachedClient.reference = _apolloClient;
  }

  return _apolloClient;
}
