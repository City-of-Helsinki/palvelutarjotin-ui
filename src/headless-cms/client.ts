/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_CMS_BASE_URL,
  cache: new InMemoryCache(),
});
export default apolloClient;
