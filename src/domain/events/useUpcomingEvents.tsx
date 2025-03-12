import { NetworkStatus } from '@apollo/client';

import {
  useUpcomingEventsQuery,
  type UpcomingEventsQueryVariables,
} from '../../generated/graphql';

type UseUpcomingEventsOptions = {
  variables: UpcomingEventsQueryVariables;
};

/**
 * Fetch a list of upcoming events.
 * NOTE: a list of upcoming events will update so regularly,
 * that it does not make sense to load it with SSR, so
 * the query hook is configured with `ssr: false`.
 */
export const useUpcomingEvents = ({ variables }: UseUpcomingEventsOptions) => {
  const {
    data: eventsData,
    fetchMore,
    networkStatus,
  } = useUpcomingEventsQuery({
    variables,
    notifyOnNetworkStatusChange: true,
    ssr: false, // Updated regularly
  });

  const events = eventsData?.upcomingEvents?.data;
  const eventsCount = eventsData?.upcomingEvents?.pageInfo.totalCount;
  const hasNextPage = eventsData?.upcomingEvents?.pageInfo.hasNextPage;
  const page = eventsData?.upcomingEvents?.pageInfo.page ?? 0;
  const nextPage = hasNextPage ? page + 1 : null;

  const fetchMoreEvents = async () => {
    if (nextPage) {
      await fetchMore({
        variables: {
          page: nextPage,
        },
      });
    }
  };

  return {
    nextPage,
    events,
    loading: networkStatus === NetworkStatus.loading,
    isLoadingMore: networkStatus === NetworkStatus.fetchMore,
    eventsCount,
    fetchMoreEvents,
  };
};
