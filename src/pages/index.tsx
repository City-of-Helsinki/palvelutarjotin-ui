import Head from 'next/head';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Home = (): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <div>
      <Head>
        <title>{t('common:appName')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>{t('common:appName')}</h1>
      </main>
    </div>
  );
};

Home.getInitialProps = async () => ({
  namespacesRequired: ['common'],
});

export default Home;
