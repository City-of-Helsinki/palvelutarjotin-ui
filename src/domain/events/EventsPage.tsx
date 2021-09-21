import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { useEventsQuery } from '../../generated/graphql';
import getPageNumberFromUrl from '../../utils/getPageNumberFromUrl';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { ROUTES } from '../app/routes/constants';
import BannerHero from '../bannerHero/BannerHero';
import { EVENT_LIST_PAGE_SIZE, EVENT_SORT_OPTIONS } from './constants';
import EventList from './eventList/EventList';
import EventSearchForm, {
  EventSearchFormValues,
} from './eventSearchForm/EventSearchForm';
import {
  getEventFilterVariables,
  getInitialValues,
  getTextFromDict,
  getSearchQueryObject,
} from './utils';

const EventsPage = (): ReactElement => {
  const router = useRouter();
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const variables = React.useMemo(
    () =>
      getEventFilterVariables(router.query, { pageSize: EVENT_LIST_PAGE_SIZE }),
    [router.query]
  );
  const [sort, setSort] = React.useState<EVENT_SORT_OPTIONS>(
    (getTextFromDict(router.query, 'sort') ||
      EVENT_SORT_OPTIONS.START_TIME) as EVENT_SORT_OPTIONS
  );

  const {
    data: eventsData,
    fetchMore,
    loading,
  } = useEventsQuery({
    ssr: false,
    variables: { ...variables, sort },
  });

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

  const eventsWithUpcomingOccurrences = eventsData?.events?.data;

  const search = (values: EventSearchFormValues) => {
    values = { ...values, organisation: values.organisationId };
    delete values.organisationId;

    router.push({
      pathname: ROUTES.HOME,
      query: getSearchQueryObject(values),
    });
  };

  const clearForm = () => {
    router.push({
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
    <PageWrapper>
      <EventsPageMeta />
      <BannerHero>
        <Container>
          <EventSearchForm
            initialValues={initialValues}
            onClear={clearForm}
            onSubmit={search}
          />
        </Container>
      </BannerHero>

      <Container>
        <LoadingSpinner isLoading={loading}>
          {eventsWithUpcomingOccurrences && (
            <EventList
              events={eventsWithUpcomingOccurrences}
              eventsCount={eventsData?.events?.meta.count}
              fetchMore={fetchMoreEvents}
              isLoading={isLoadingMore}
              shouldShowLoadMore={shouldShowLoadMore}
              sort={sort}
              setSort={setSort}
            />
          )}
        </LoadingSpinner>
      </Container>
    </PageWrapper>
  );
};

const EventsPageMeta: React.FC = () => {
  const { t } = useTranslation();
  const title = 'Kultus beta';
  const description = t('events:pageMeta.description');

  const openGraphProperties: { [key: string]: string } = {
    description,
    title,
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={t('events:pageMeta.keywords')} />
      {Object.entries(openGraphProperties).map(([property, value]) => (
        <meta key={property} property={`og:${property}`} content={value} />
      ))}
    </Head>
  );
};

export default EventsPage;
