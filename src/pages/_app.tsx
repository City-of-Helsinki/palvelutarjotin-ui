import { ApolloProvider } from '@apollo/react-hooks';
import {
  createInstance as createMatomoInstance,
  MatomoProvider,
} from '@datapunt/matomo-tracker-react';
import * as Sentry from '@sentry/browser';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import flow from 'lodash/flow';
import App from 'next/app';
import React, { ErrorInfo } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import '../assets/styles/main.scss';
import withApollo from '../domain/app/apollo/configureApollo';
import PageLayout from '../domain/app/layout/PageLayout';
import { store } from '../domain/app/store';
import { appWithTranslation, i18n } from '../i18n';
import FocusToTop from './FocusToTop';

interface Props {
  apollo: ApolloClient<NormalizedCacheObject>;
}

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  });
}

const matomoInstance = createMatomoInstance({
  disabled: process.env.NEXT_PUBLIC_MATOMO_ENABLED !== 'true',
  urlBase: process.env.NEXT_PUBLIC_MATOMO_URL_BASE as string,
  siteId: Number(process.env.NEXT_PUBLIC_MATOMO_SITE_ID),
});

class MyApp extends App<Props> {
  componentDidMount() {
    // Change <html>'s language on languageChanged event
    i18n.on('languageChanged', (lang) => {
      const html = document.querySelector('html');

      if (html) {
        html.setAttribute('lang', lang);
      }
    });
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.withScope((scope) => {
      scope.setExtra('componentStack', errorInfo.componentStack);

      Sentry.captureException(error);
    });

    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { apollo, Component, pageProps } = this.props;

    return (
      <ApolloProvider client={apollo}>
        <Provider store={store}>
          <MatomoProvider value={matomoInstance}>
            <FocusToTop />
            <PageLayout
              {...pageProps}
              namespacesRequired={['common', 'footer']}
            >
              <Component {...pageProps} />
            </PageLayout>
            <ToastContainer position="bottom-right" />
          </MatomoProvider>
        </Provider>
      </ApolloProvider>
    );
  }
}

export default flow(withApollo, appWithTranslation)(MyApp);
