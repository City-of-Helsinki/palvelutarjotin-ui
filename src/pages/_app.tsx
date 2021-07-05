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
import PageLayout from '../domain/app/layout/PageLayout';
import { store } from '../domain/app/store';
import FocusToTop from '../FocusToTop';
import useLocale from '../hooks/useLocale';

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

const MyApp = ({ Component, pageProps }: AppProps) => {
  const locale = useLocale();

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
          <PageLayout {...pageProps}>
            <Component {...pageProps} />
          </PageLayout>
          <ToastContainer position="bottom-right" />
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
