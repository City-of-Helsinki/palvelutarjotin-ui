import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';

const EventPage = (): ReactElement => {
  const { t } = useTranslation();
  return (
    <PageWrapper title={t('event:pageTitle')}>
      <Container>TODO: EVENT PAGE</Container>
    </PageWrapper>
  );
};

export default EventPage;
