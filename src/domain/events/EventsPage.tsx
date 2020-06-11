import Head from 'next/head';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import Container from '../app/layout/Container';

const EventsPage = (): ReactElement => {
  const { t } = useTranslation();

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
      </main>
    </div>
  );
};

export default EventsPage;
