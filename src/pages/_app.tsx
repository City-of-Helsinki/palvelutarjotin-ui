import { NormalizedCacheObject } from '@apollo/client';
import * as Sentry from '@sentry/browser';
import type { AppProps as NextAppProps } from 'next/app';
import dynamic from 'next/dynamic';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import {
  appWithTranslation,
  SSRConfig,
  UserConfig,
  useTranslation,
} from 'next-i18next';
import React from 'react';
import { ConfigProvider as RHHCConfigProvider } from 'react-helsinki-headless-cms';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import nextI18nextConfig from '../../next-i18next.config';
import LoadingSpinner from '../common/components/loadingSpinner/LoadingSpinner';
import '../assets/styles/main.scss';
import Center from '../domain/app/Center';
import ErrorBoundary from '../domain/app/ErrorBoundary';
import CmsPageLayout from '../domain/app/layout/CmsPageLayout';
import PageLayout from '../domain/app/layout/PageLayout';
import { getCmsArticlePath, getCmsPagePath } from '../domain/app/routes/utils';
import { store } from '../domain/app/store';
import MatomoTracker from '../domain/matomo/Matomo';
import FocusToTop from '../FocusToTop';
import { useCmsApollo } from '../headless-cms/cmsApolloClient';
import CMSApolloProvider from '../headless-cms/cmsApolloContext';
import { useRHHCConfig } from '../headless-cms/useRHHCConfig';
import useLocale from '../hooks/useLocale';
import '../styles/globals.scss';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  });
}
const DynamicCookieConsentWithNoSSR = dynamic(
  () => import('../domain/cookieConsent/CookieConsent'),
  { ssr: false }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppProps<P = any> = {
  pageProps: P;
} & Omit<NextAppProps<P>, 'pageProps'>;

export type CustomPageProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  initialApolloState: NormalizedCacheObject;
} & SSRConfig;

const PageLayoutComponent = (
  props: CustomPageProps & { children: React.ReactNode }
) => {
  const router = useRouter();

  return [getCmsPagePath(''), getCmsArticlePath('')].some((path) =>
    router.route.startsWith(path)
  ) ? (
    <CmsPageLayout {...props} />
  ) : (
    <PageLayout {...props} />
  );
};

const MyApp = ({ Component, pageProps }: AppProps<CustomPageProps>) => {
  const router = useRouter();
  const locale = useLocale();
  const { t } = useTranslation();
  const cmsApolloClient = useCmsApollo(pageProps.initialApolloState);
  const rhhcConfig = useRHHCConfig({ cmsApolloClient });

  React.useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.setAttribute('lang', locale);
    }
  }, [locale]);

  return (
    <ErrorBoundary>
      <RHHCConfigProvider config={rhhcConfig}>
        <Provider store={store}>
          <MatomoTracker>
            <FocusToTop />
            {router.isFallback ? (
              <Center>
                <LoadingSpinner isLoading={router.isFallback} />
              </Center>
            ) : pageProps.error ? (
              <NextError
                statusCode={pageProps.error.networkError?.statusCode ?? 400}
              />
            ) : (
              <CMSApolloProvider value={cmsApolloClient}>
                <PageLayoutComponent {...pageProps}>
                  <Component {...pageProps} />
                  <DynamicCookieConsentWithNoSSR
                    appName={t('common:appName')}
                  />
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

export default appWithTranslation(MyApp, nextI18nextConfig as UserConfig);
