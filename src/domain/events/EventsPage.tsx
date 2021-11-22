import { Koros } from 'hds-react';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import React, { ReactElement } from 'react';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { usePopularKeywordsQuery } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import localizedString from '../../utils/getLocalisedString';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { ROUTES } from '../app/routes/constants';
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
      <PopularKeywords />
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
      <Koros className={styles.korosTop} />
      <div className={styles.popularKeywordsSection}>
        <Container>
          <h2>{t('events:titlePopularEventCategories')}</h2>
          <div className={styles.keywordsList}>
            {popularKeywords.map((keyword) => (
              <Link
                key={keyword.id}
                href={{
                  pathname: ROUTES.EVENTS_SEARCH,
                  query: keyword.id ? { categories: [keyword.id] } : null,
                }}
              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>{localizedString(keyword.name, locale)}</a>
              </Link>
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
