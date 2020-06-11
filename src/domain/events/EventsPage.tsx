import Head from 'next/head';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import LanguageDropdown from '../../domain/app/header/languageDropdown/LanguageDropdown';

const EventsPage = (): ReactElement => {
  const { t } = useTranslation();

  return (
    <div>
      <Head>
        <title>{t('common:appName')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>{t('common:appName')}</h1>
        <LanguageDropdown />
      </main>
    </div>
  );
};

export default EventsPage;
