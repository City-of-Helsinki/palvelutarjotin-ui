import type { FieldMergeFunction } from '@apollo/client';
import { InMemoryCache } from '@apollo/client';

const excludeArgs =
  (excludedArgs: string[]) =>
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: Record<string, any> | null
  ) =>
    args
      ? Object.keys(args).filter((key: string) => !excludedArgs.includes(key))
      : false;

const getPageStylePaginator = (merge: FieldMergeFunction) => ({
  // Only ignore page argument in caching to get fetchMore pagination working correctly
  // Other args are needed to separate different serch queries to separate caches
  // Docs: https://www.apollographql.com/docs/react/pagination/key-args/
  keyArgs: excludeArgs(['page']),
  merge,
});

export const createApolloCache = () =>
  new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          keyword(_, { args, toReference }) {
            return toReference({
              __typename: 'Keyword',
              id: args?.id,
            });
          },
          place(_, { args, toReference }) {
            return toReference({
              __typename: 'Place',
              id: args?.id,
            });
          },
          venue(_, { args, toReference }) {
            return toReference({
              __typename: 'VenueNode',
              id: args?.id,
            });
          },
          events: getPageStylePaginator((existing, incoming) => {
            if (!incoming) return existing;
            return {
              data: [...(existing?.data ?? []), ...incoming.data],
              meta: incoming.meta,
            };
          }),
          upcomingEvents: getPageStylePaginator((existing, incoming) => {
            if (!incoming) return existing;
            return {
              data: [...(existing?.data ?? []), ...incoming.data],
              pageInfo: incoming.pageInfo,
            };
          }),
        },
      },
    },
  });
