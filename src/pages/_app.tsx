import { ApolloProvider } from '@apollo/react-hooks';
import * as Sentry from '@sentry/browser';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import flow from 'lodash/flow';
import App from 'next/app';
import { Router } from 'next/router';
import React, { ErrorInfo } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import '../assets/styles/main.scss';
import withApollo from '../domain/app/apollo/configureApollo';
import PageLayout from '../domain/app/layout/PageLayout';
import { store } from '../domain/app/store';
import { appWithTranslation, i18n } from '../i18n';

interface Props {
  apollo: ApolloClient<NormalizedCacheObject>;
}

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  });
}

class MyApp extends App<Props> {
  componentDidMount() {
    // Change <html>'s language on languageChanged event
    i18n.on('languageChanged', (lang) => {
      const html = document.querySelector('html');

      if (html) {
        html.setAttribute('lang', lang);
      }
    });

    this.setTabIndexOnRouteChange();
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.withScope((scope) => {
      scope.setExtra('componentStack', errorInfo.componentStack);

      Sentry.captureException(error);
    });

    super.componentDidCatch(error, errorInfo);
  }

  // next focuses body between route changes if it has tabIndex=-1
  setTabIndexOnRouteChange() {
    // see: https://github.com/vercel/next.js/issues/7681#issuecomment-603032899
    Router.events.on('routeChangeStart', () => {
      document.body.setAttribute('tabIndex', '-1');
    });

    document.body.addEventListener('blur', () => {
      document.body.removeAttribute('tabIndex');
    });
  }

  render() {
    const { apollo, Component, pageProps } = this.props;

    return (
      <ApolloProvider client={apollo}>
        <Provider store={store}>
          <PageLayout {...pageProps} namespacesRequired={['common', 'footer']}>
            <Component {...pageProps} />
          </PageLayout>
          <ToastContainer position="bottom-right" />
        </Provider>
      </ApolloProvider>
    );
  }
}

export default flow(withApollo, appWithTranslation)(MyApp);
