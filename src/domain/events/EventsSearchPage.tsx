import { ParsedUrlQuery } from 'querystring';

import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import * as React from 'react';
import useLocalStorage from 'react-use/lib/useLocalStorage';

import { EVENT_LIST_PAGE_SIZE, EVENT_SORT_OPTIONS } from './constants';
import EventList from './eventList/EventList';
import EventSearchForm, {
  EventSearchFormValues,
  PanelState,
} from './eventSearchForm/EventSearchForm';
import styles from './eventsSearchPage.module.scss';
import {
  getEventFilterVariables,
  getInitialValues,
  getSearchQueryObject,
  getTextFromDict,
} from './utils';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { useEventsQuery } from '../../generated/graphql';
import type { I18nNamespace } from '../../types';
import getPageNumberFromUrl from '../../utils/getPageNumberFromUrl';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { ROUTES } from '../app/routes/constants';

export const EVENT_SORT_STORAGE_KEY = 'event-search-sort';

const panelStates = {
  closed: PanelState.Compact,
  open: PanelState.Advanced,
};

// Search panels shoud be expanded if sarch parameters are used (other than text)
const getPanelStateFromQuery = (query: ParsedUrlQuery) => {
  const filteredKeys = Object.keys(query).filter((k) => k !== 'text');
  return filteredKeys.length > 0 ? panelStates.open : panelStates.closed;
};

const EventsSearchPage: React.FC = () => {
  const { t } = useTranslation<I18nNamespace>();
  const router = useRouter();
  const [searchPanelState, setSearchPanelState] = React.useState<PanelState>(
    () => getPanelStateFromQuery(router.query)
  );
  const {
    initialValues,
    search,
    loading,
    events,
    eventsCount,
    fetchMoreEvents,
    isLoadingMore,
    nextPage,
    setSort,
    sort,
    filterActive,
  } = useEventsSearch();

  const handleFormReset = () => {
    router.push(ROUTES.EVENTS_SEARCH, undefined, {
      scroll: false,
    });
  };

  const handleToggleAdvancedSearch = () => {
    setSearchPanelState(
      searchPanelState === panelStates.closed
        ? panelStates.open
        : panelStates.closed
    );
  };

  React.useEffect(() => {
    setSearchPanelState(getPanelStateFromQuery(router.query));
  }, [router.query]);

  return (
    <PageWrapper title={t('events:eventsSearchPage.title')}>
      <div className={styles.searchFormContainer}>
        <Container>
          <EventSearchForm
            initialValues={initialValues}
            onSubmit={search}
            onToggleAdvancedSearch={handleToggleAdvancedSearch}
            panelState={searchPanelState}
            filterActive={filterActive}
            onReset={handleFormReset}
          />
        </Container>
      </div>
      <Container>
        <LoadingSpinner isLoading={loading}>
          {events && (
            <EventList
              events={events}
              eventsCount={eventsCount}
              fetchMore={fetchMoreEvents}
              isLoading={isLoadingMore}
              shouldShowLoadMore={Boolean(nextPage)}
              sort={sort}
              setSort={setSort}
            />
          )}
        </LoadingSpinner>
      </Container>
    </PageWrapper>
  );
};

/**
 * Fetch a list of event search results.
 * NOTE: This query should not be executed on with SSR,
 * because the result list will be updated regularly.
 * The query hook should be executed with `ssr: false`.
 */
export const useEventsSearch = () => {
  const router = useRouter();
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const variables = React.useMemo(
    () =>
      getEventFilterVariables(router.query, { pageSize: EVENT_LIST_PAGE_SIZE }),
    [router.query]
  );

  const {
    text,
    division,
    end,
    inLanguage,
    start,
    keywordOrSet1,
    keywordOrSet2,
    keywordOrSet3,
    location,
    isFree,
  } = variables;

  const filterActive =
    !!text?.length ||
    !!division?.length ||
    !!inLanguage?.length ||
    !!keywordOrSet1?.length ||
    !!keywordOrSet2?.length ||
    !!keywordOrSet3?.length ||
    !!location ||
    !!end ||
    !!isFree ||
    start !== 'now';

  const [sort, setSort] = useLocalStorage<EVENT_SORT_OPTIONS>(
    EVENT_SORT_STORAGE_KEY,
    (getTextFromDict(router.query, 'sort') ||
      EVENT_SORT_OPTIONS.START_TIME) as EVENT_SORT_OPTIONS
  );

  const {
    data: eventsData,
    fetchMore,
    loading,
  } = useEventsQuery({
    ssr: false, // Updated regularly
    variables: { ...variables, sort },
  });
  const eventsCount = eventsData?.events?.meta.count;

  const organisationName =
    eventsData?.events?.data?.filter(
      (event) => event.pEvent.organisation?.id === router.query?.organisation
    )[0]?.pEvent.organisation?.name || '';

  const initialValues = React.useMemo(() => {
    return {
      ...getInitialValues(router.query),
      organisation: organisationName,
      organisationId: router.query?.organisation as string,
    };
  }, [router.query, organisationName]);

  const events = eventsData?.events?.data;

  const search = (values: EventSearchFormValues) => {
    values = { ...values, organisation: values.organisationId };
    delete values.organisationId;

    router.push(
      {
        pathname: ROUTES.EVENTS_SEARCH,
        query: getSearchQueryObject(values),
      },
      undefined,
      { scroll: false }
    );
  };

  const nextPage = React.useMemo(() => {
    const nextUrl = eventsData?.events?.meta.next;
    return nextUrl ? getPageNumberFromUrl(nextUrl) : null;
  }, [eventsData?.events?.meta?.next]);

  const fetchMoreEvents = async () => {
    if (nextPage) {
      try {
        setIsLoadingMore(true);
        await fetchMore({
          variables: {
            page: nextPage,
          },
        });
        setIsLoadingMore(false);
      } catch {
        setIsLoadingMore(false);
      }
    }
  };

  return {
    nextPage,
    events,
    initialValues,
    loading,
    sort,
    isLoadingMore,
    eventsCount,
    setSort,
    search,
    fetchMoreEvents,
    filterActive,
  };
};

export default EventsSearchPage;
