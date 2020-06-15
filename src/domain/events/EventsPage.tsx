import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { useEventsQuery, EventsQuery } from '../../generated/graphql';
import { Router } from '../../i18n';
import getPageNumberFromUrl from '../../utils/getPageNumberFromUrl';
import Container from '../app/layout/Container';
import { ROUTES } from '../app/routes/constants';
import { EVENT_LIST_PAGE_SIZE, EVENT_SORT_OPTIONS } from './constants';
import EventList from './eventList/EventList';
import EventSearchForm, {
  EventSearchFormValues,
} from './eventSearchForm/EventSearchForm';
import {
  getEventFilterVariables,
  getInitialValues,
  getTextFromDict,
} from './utils';

const EventsPage = (): ReactElement => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const variables = React.useMemo(
    () => getEventFilterVariables(query, { pageSize: EVENT_LIST_PAGE_SIZE }),
    [query]
  );
  const [sort, setSort] = React.useState<EVENT_SORT_OPTIONS>(
    (getTextFromDict(query, 'sort') ||
      EVENT_SORT_OPTIONS.START_TIME) as EVENT_SORT_OPTIONS
  );

  const initialValues = React.useMemo(() => getInitialValues(query), [query]);

  const { data: eventsData, fetchMore, loading } = useEventsQuery({
    ssr: false,
    variables: { ...variables, sort },
  });

  const search = (values: EventSearchFormValues) => {
    Router.push({
      pathname: ROUTES.HOME,
      query: values,
    });
  };

  const clearForm = () => {
    Router.push({
      pathname: ROUTES.HOME,
      query: {},
    });
  };

  const nextPage = React.useMemo(() => {
    const nextUrl = eventsData?.events?.meta.next;
    return nextUrl ? getPageNumberFromUrl(nextUrl) : null;
  }, [eventsData?.events?.meta?.next]);

  const shouldShowLoadMore = Boolean(nextPage);

  const fetchMoreEvents = async () => {
    if (nextPage) {
      try {
        setIsLoadingMore(true);
        await fetchMore({
          updateQuery: (prev: EventsQuery, { fetchMoreResult }) => {
            if (!fetchMoreResult?.events) {
              return prev;
            }

            const prevEvents = prev.events?.data || [];
            const newEvents = fetchMoreResult.events?.data || [];
            fetchMoreResult.events.data = [...prevEvents, ...newEvents];

            return fetchMoreResult;
          },
          variables: {
            page: nextPage,
          },
        });
        setIsLoadingMore(false);
      } catch (e) {
        setIsLoadingMore(false);
      }
    }
  };

  return (
    <div>
      <Head>
        <title>{t('common:appName')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container>
          <h1>{t('common:appName')}</h1>
        </Container>
        <EventSearchForm
          initialValues={initialValues}
          onClear={clearForm}
          onSubmit={search}
        />
        <Container>
          <LoadingSpinner isLoading={loading}>
            {eventsData && (
              <EventList
                eventsData={eventsData}
                fetchMore={fetchMoreEvents}
                isLoading={isLoadingMore}
                shouldShowLoadMore={shouldShowLoadMore}
                sort={sort}
                setSort={setSort}
              />
            )}
          </LoadingSpinner>
        </Container>
      </main>
    </div>
  );
};

export default EventsPage;
