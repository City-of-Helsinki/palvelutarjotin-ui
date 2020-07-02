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

const CreateEnrolmentPage = (): ReactElement => {
  const { t } = useTranslation();
  const {
    query: { eventId },
  } = useRouter();

  const { data: eventData, loading } = useEventQuery({
    variables: { id: eventId as string },
  });

  return (
    <PageWrapper title={t('enrolment:pageTitle')}>
      <LoadingSpinner isLoading={loading}>
        {eventData?.event ? (
          <Container>
            <h1>{t('enrolment:title')}</h1>
          </Container>
        ) : (
          <NotFoundPage />
        )}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default CreateEnrolmentPage;
