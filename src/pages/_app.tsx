import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';

import '../assets/styles/main.scss';
import PageLayout from '../domain/app/layout/PageLayout';
import { store } from '../domain/app/store';
import { appWithTranslation } from '../i18n';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Provider store={store}>
        <PageLayout {...pageProps} namespacesRequired={['common', 'footer']}>
          <Component {...pageProps} />
        </PageLayout>
      </Provider>
    );
  }
}

export default appWithTranslation(MyApp);
