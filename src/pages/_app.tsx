import { ApolloProvider } from '@apollo/client';
import * as Sentry from '@sentry/browser';
import * as Matomo from '@socialgouv/matomo-next';
import dynamic from 'next/dynamic';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import { appWithTranslation, UserConfig, useTranslation } from 'next-i18next';
import React from 'react';
import { ConfigProvider as RHHCConfigProvider } from 'react-helsinki-headless-cms';
import { ToastContainer } from 'react-toastify';

import nextI18nextConfig from '../../next-i18next.config';
import LoadingSpinner from '../common/components/loadingSpinner/LoadingSpinner';
import '../assets/styles/main.scss';
import { useApolloClient } from '../domain/app/apollo/apolloClient';
import Center from '../domain/app/Center';
import ErrorBoundary from '../domain/app/ErrorBoundary';
import CmsPageLayout from '../domain/app/layout/CmsPageLayout';
import PageLayout from '../domain/app/layout/PageLayout';
import { getCmsArticlePath, getCmsPagePath } from '../domain/app/routes/utils';
import { useCMSApolloClient } from '../domain/headless-cms/apollo/apolloClient';
import { useRHHCConfig } from '../domain/headless-cms/useRHHCConfig';
import FocusToTop from '../FocusToTop';
import useLocale from '../hooks/useLocale';
import type { AppProps, CustomPageProps, I18nNamespace } from '../types';
import '../styles/globals.scss';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  });
}
// No cookie consent should be rendered on server side, because it's a personal choice
// and the answer is stored in browser's local storage.
const DynamicCookieConsentWithNoSSR = dynamic(
  () => import('../domain/cookieConsent/CookieConsent'),
  { ssr: false }
);

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
  const { t } = useTranslation<I18nNamespace>();
  const apolloClient = useApolloClient({
    initialApolloState: pageProps.initialApolloState,
  });
  const cmsApolloClient = useCMSApolloClient({
    initialCMSApolloState: pageProps.initialCMSApolloState,
  });
  const rhhcConfig = useRHHCConfig({
    cmsApolloClient,
    eventsApolloClient: apolloClient,
  });

  React.useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.setAttribute('lang', locale);
    }
  }, [locale]);

  React.useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_MATOMO_URL_BASE &&
      process.env.NEXT_PUBLIC_MATOMO_SITE_ID
    ) {
      Matomo.init({
        jsTrackerFile: process.env.NEXT_PUBLIC_MATOMO_SRC_URL,
        phpTrackerFile: process.env.NEXT_PUBLIC_MATOMO_TRACKER_URL,
        url: process.env.NEXT_PUBLIC_MATOMO_URL_BASE,
        siteId: process.env.NEXT_PUBLIC_MATOMO_SITE_ID,
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <RHHCConfigProvider config={rhhcConfig}>
        <ApolloProvider client={apolloClient}>
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
            <PageLayoutComponent {...pageProps}>
              <Component {...pageProps} />
              <DynamicCookieConsentWithNoSSR appName={t('common:appName')} />
            </PageLayoutComponent>
          )}
          <ToastContainer position="top-right" />
        </ApolloProvider>
      </RHHCConfigProvider>
    </ErrorBoundary>
  );
};

export default appWithTranslation(MyApp, nextI18nextConfig as UserConfig);
