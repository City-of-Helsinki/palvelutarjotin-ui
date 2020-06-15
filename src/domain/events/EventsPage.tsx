import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { useEventsQuery } from '../../generated/graphql';
import { Router } from '../../i18n';
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
  const variables = React.useMemo(
    () => getEventFilterVariables(query, { pageSize: EVENT_LIST_PAGE_SIZE }),
    [query]
  );
  const [sort, setSort] = React.useState<EVENT_SORT_OPTIONS>(
    (getTextFromDict(query, 'sort') ||
      EVENT_SORT_OPTIONS.START_TIME) as EVENT_SORT_OPTIONS
  );

  const initialValues = React.useMemo(() => getInitialValues(query), [query]);

  const { data: eventsData, loading } = useEventsQuery({
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
