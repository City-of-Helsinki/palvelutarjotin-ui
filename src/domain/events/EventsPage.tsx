import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { ReactElement } from 'react';

import EventList from './eventList/EventList';
import EventSearchForm, {
  EventSearchFormValues,
  PanelState,
} from './eventSearchForm/EventSearchForm';
import styles from './eventsPage.module.scss';
import { PopularKeywords } from './PopularKeywords';
import { useUpcomingEvents } from './useUpcomingEvents';
import { getSearchQueryObject } from './utils';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { ROUTES } from '../app/routes/constants';
import BannerHero from '../bannerHero/BannerHero';

const panelStates = {
  closed: PanelState.Condensed,
  open: PanelState.Advanced,
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

export default EventsPage;
