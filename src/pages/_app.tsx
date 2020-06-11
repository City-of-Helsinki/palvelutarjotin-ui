import App from 'next/app';
import React from 'react';

import '../assets/styles/main.scss';
import PageLayout from '../domain/app/layout/PageLayout';
import { appWithTranslation } from '../i18n';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <PageLayout {...pageProps} namespacesRequired={['common', 'footer']}>
        <Component {...pageProps} />
      </PageLayout>
    );
  }
}

export default appWithTranslation(MyApp);
