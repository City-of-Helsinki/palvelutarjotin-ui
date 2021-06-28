import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from '@apollo/client';
import {
  createInstance as createMatomoInstance,
  MatomoProvider,
} from '@datapunt/matomo-tracker-react';
import * as Sentry from '@sentry/browser';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import React, { ErrorInfo } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import nextI18nextConfig from '../../next-i18next.config';
import '../assets/styles/main.scss';
import withApollo from '../domain/app/apollo/configureApollo';
import PageLayout from '../domain/app/layout/PageLayout';
import { store } from '../domain/app/store';
import useLocale from '../hooks/useLocale';
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

const MyApp = ({ Component, pageProps, apollo }: AppProps & Props) => {
  const locale = useLocale();

  React.useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.setAttribute('lang', locale);
    }
  }, [locale]);

  return (
    <ErrorBoundary>
      <ApolloProvider client={apollo}>
        <Provider store={store}>
          <MatomoProvider value={matomoInstance}>
            <FocusToTop />
            <PageLayout {...pageProps}>
              <Component {...pageProps} />
            </PageLayout>
            <ToastContainer position="bottom-right" />
          </MatomoProvider>
        </Provider>
      </ApolloProvider>
    </ErrorBoundary>
  );
};

class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.withScope((scope) => {
      scope.setExtra('componentStack', errorInfo.componentStack);

      Sentry.captureException(error);
    });

    super.componentDidCatch?.(error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withApollo(appWithTranslation(MyApp as any, nextI18nextConfig));
