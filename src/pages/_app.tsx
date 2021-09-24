import {
  createInstance as createMatomoInstance,
  MatomoProvider,
} from '@datapunt/matomo-tracker-react';
import * as Sentry from '@sentry/browser';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import React, { ErrorInfo } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import nextI18nextConfig from '../../next-i18next.config';
import '../assets/styles/main.scss';
import PageLayout from '../domain/app/layout/PageLayout';
import { store } from '../domain/app/store';
import FocusToTop from '../FocusToTop';
import { useCmsApollo } from '../headless-cms/cmsApolloClient';
import CMSApolloProvider from '../headless-cms/cmsApolloContext';
import useLocale from '../hooks/useLocale';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  });
}

const getMatomoUrlPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_MATOMO_URL_BASE}${path}`;

const matomoInstance = createMatomoInstance({
  disabled: process.env.NEXT_PUBLIC_MATOMO_ENABLED !== 'true',
  urlBase: process.env.NEXT_PUBLIC_MATOMO_URL_BASE as string,
  srcUrl:
    process.env.NEXT_PUBLIC_MATOMO_SRC_URL &&
    getMatomoUrlPath(process.env.NEXT_PUBLIC_MATOMO_SRC_URL),
  trackerUrl:
    process.env.NEXT_PUBLIC_MATOMO_TRACKER_URL &&
    getMatomoUrlPath(process.env.NEXT_PUBLIC_MATOMO_TRACKER_URL),
  siteId: Number(process.env.NEXT_PUBLIC_MATOMO_SITE_ID),
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  const locale = useLocale();
  const cmsApolloClient = useCmsApollo(pageProps.initialApolloState);

  React.useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.setAttribute('lang', locale);
    }
  }, [locale]);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <MatomoProvider value={matomoInstance}>
          <FocusToTop />
          <CMSApolloProvider value={cmsApolloClient}>
            <PageLayout {...pageProps}>
              <Component {...pageProps} />
            </PageLayout>
          </CMSApolloProvider>
          <ToastContainer position="top-right" />
        </MatomoProvider>
      </Provider>
    </ErrorBoundary>
  );
};

class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(error);
    }

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
export default appWithTranslation(MyApp as any, nextI18nextConfig);
