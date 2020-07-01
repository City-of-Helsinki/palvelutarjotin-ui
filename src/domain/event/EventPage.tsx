import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { useEventQuery } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import getLocalisedString from '../../utils/getLocalisedString';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import NotFoundPage from '../notFoundPage/NotFoundPage';

interface Params {
  id: string;
}

const EventPage = (): ReactElement => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { query } = useRouter();
  const { id } = query;

  const { data: eventData, loading } = useEventQuery({
    variables: { id: id as string },
  });

  const name = getLocalisedString(eventData?.event?.name || {}, locale);

  return (
    <PageWrapper title={name || t('event:pageTitle')}>
      <LoadingSpinner isLoading={loading}>
        {eventData?.event ? (
          <Container>
            <h1>{name}</h1>
          </Container>
        ) : (
          <NotFoundPage />
        )}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default EventPage;
