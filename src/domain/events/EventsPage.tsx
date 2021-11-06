import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React, { ReactElement } from 'react';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import BannerHero from '../bannerHero/BannerHero';
import EventList from './eventList/EventList';
import EventSearchForm, { PanelState } from './eventSearchForm/EventSearchForm';
import styles from './eventsPage.module.scss';
import { useEventsSearch } from './EventsSearchPage';

const panelStates = {
  closed: PanelState.Condensed,
  open: PanelState.Advanced,
};

const EventsPage = (): ReactElement => {
  const [searchPanelState, setSearchPanelState] = React.useState<PanelState>(
    panelStates.closed
  );

  const {
    initialValues,
    loading,
    events,
    eventsCount,
    isLoadingMore,
    nextPage,
    sort,
    fetchMoreEvents,
    search,
    setSort,
  } = useEventsSearch();

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
              initialValues={initialValues}
              onSubmit={search}
              onToggleAdvancedSearch={handleToggleAdvancedSearch}
              panelState={searchPanelState}
            />
          </div>
        </Container>
      </BannerHero>

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
