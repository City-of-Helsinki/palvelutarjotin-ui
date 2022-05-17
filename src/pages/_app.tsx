import * as Sentry from '@sentry/browser';
import { LoadingSpinner } from 'hds-react';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { ErrorInfo } from 'react';
import {
  ConfigProvider as RHHCConfigProvider,
  defaultConfig as rhhcDefaultConfig,
} from 'react-helsinki-headless-cms';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import nextI18nextConfig from '../../next-i18next.config';
import '../assets/styles/main.scss';
import CmsPageLayout from '../domain/app/layout/CmsPageLayout';
import PageLayout from '../domain/app/layout/PageLayout';
import { store } from '../domain/app/store';
import MatomoTracker from '../domain/matomo/Matomo';
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

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const locale = useLocale();
  const cmsApolloClient = useCmsApollo(pageProps.initialApolloState);
  const rhhcConfig = React.useMemo(
    () => ({
      ...rhhcDefaultConfig,
      utils: {
        ...rhhcDefaultConfig.utils,
        getIsHrefExternal: (href: string) => {
          if (href?.includes(router.basePath) || !href?.startsWith('http')) {
            return true;
          }
          return false;
        },
      },
    }),
    [router.basePath]
  );
  React.useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.setAttribute('lang', locale);
    }
  }, [locale]);

  const PageLayoutComponent = router.route.startsWith('/cms-page')
    ? CmsPageLayout
    : PageLayout;

  return (
    <ErrorBoundary>
      <RHHCConfigProvider config={rhhcConfig}>
        <Provider store={store}>
          <MatomoTracker>
            <FocusToTop />
            {router.isFallback ? (
              <Center>
                <LoadingSpinner />
              </Center>
            ) : pageProps.error ? (
              <NextError
                statusCode={pageProps.error.networkError?.statusCode ?? 400}
              />
            ) : (
              <CMSApolloProvider value={cmsApolloClient}>
                <PageLayoutComponent {...pageProps}>
                  <Component {...pageProps} />
                </PageLayoutComponent>
              </CMSApolloProvider>
            )}
            <ToastContainer position="top-right" />
          </MatomoTracker>
        </Provider>
      </RHHCConfigProvider>
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

const Center: React.FC = ({ children }) => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default appWithTranslation(MyApp as any, nextI18nextConfig);
