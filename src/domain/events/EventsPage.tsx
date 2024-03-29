import { NetworkStatus } from '@apollo/client';
import { Koros } from 'hds-react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { ReactElement } from 'react';

import EventList from './eventList/EventList';
import EventSearchForm, {
  EventSearchFormValues,
  PanelState,
} from './eventSearchForm/EventSearchForm';
import styles from './eventsPage.module.scss';
import { getSearchQueryObject } from './utils';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import {
  usePopularKeywordsQuery,
  useUpcomingEventsQuery,
  UpcomingEventsQueryVariables,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import localizedString from '../../utils/getLocalisedString';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { ROUTES } from '../app/routes/constants';
import BannerHero from '../bannerHero/BannerHero';

const panelStates = {
  closed: PanelState.Condensed,
  open: PanelState.Advanced,
};

const EventsPage = (): ReactElement => {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchPanelState, setSearchPanelState] = React.useState<PanelState>(
    panelStates.closed
  );

  const {
    events,
    eventsCount,
    fetchMoreEvents,
    nextPage,
    loading,
    isLoadingMore,
  } = useUpcomingEvents({
    variables: {
      include: ['keywords', 'location', 'audience', 'in_language'],
    },
  });

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

  const handleToggleAdvancedSearch = () => {
    setSearchPanelState(
      searchPanelState === panelStates.closed
        ? panelStates.open
        : panelStates.closed
    );
  };

  return (
    <PageWrapper>
      <EventsPageMeta />
      <BannerHero>
        <Container>
          <div className={styles.eventsSearchForm}>
            <EventSearchForm
              onSubmit={search}
              onToggleAdvancedSearch={handleToggleAdvancedSearch}
              panelState={searchPanelState}
            />
          </div>
        </Container>
      </BannerHero>
      <PopularKeywords />
      <Container>
        <LoadingSpinner isLoading={loading}>
          {events && (
            <EventList
              title={t('events:eventList.titleUpcomingEvents')}
              showCount={false}
              events={events}
              isLoading={isLoadingMore}
              eventsCount={eventsCount}
              shouldShowLoadMore={Boolean(nextPage)}
              fetchMore={fetchMoreEvents}
            />
          )}
        </LoadingSpinner>
      </Container>
    </PageWrapper>
  );
};

const PopularKeywords: React.FC = () => {
  const locale = useLocale();
  const { t } = useTranslation();
  const { data } = usePopularKeywordsQuery({
    variables: {
      amount: 10,
      showAllKeywords: true,
    },
    ssr: false,
  });
  const popularKeywords = data?.popularKultusKeywords?.data;

  return popularKeywords ? (
    <div className={styles.popularKeywords}>
      <div className={styles.popularKeywordsSection}>
        <Container>
          <h2>{t('events:titlePopularEventCategories')}</h2>
          <div className={styles.keywordsList}>
            {popularKeywords.map((keyword) => (
              <NextLink
                legacyBehavior
                key={keyword.id}
                href={{
                  pathname: ROUTES.EVENTS_SEARCH,
                  query: keyword.id ? { categories: [keyword.id] } : null,
                }}
              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>{localizedString(keyword.name, locale)}</a>
              </NextLink>
            ))}
          </div>
        </Container>
      </div>
      <Koros className={styles.korosBottom} />
    </div>
  ) : (
    <Koros className={styles.korosBottom} />
  );
};

const EventsPageMeta: React.FC = () => {
  const { t } = useTranslation();
  const title = 'Kultus';
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
type UseUpcomingEventsOptions = {
  variables: UpcomingEventsQueryVariables;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useUpcomingEvents = ({ variables }: UseUpcomingEventsOptions) => {
  const {
    data: eventsData,
    fetchMore,
    networkStatus,
  } = useUpcomingEventsQuery({
    variables,
    notifyOnNetworkStatusChange: true,
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

export default EventsPage;
