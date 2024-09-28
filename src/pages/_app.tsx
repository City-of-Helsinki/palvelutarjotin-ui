import { NormalizedCacheObject } from '@apollo/client';
import * as Sentry from '@sentry/browser';
import type { AppProps as NextAppProps } from 'next/app';
import dynamic from 'next/dynamic';
import NextError from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { appWithTranslation, SSRConfig, useTranslation } from 'next-i18next';
import React, { ErrorInfo } from 'react';
import {
  Config,
  ConfigProvider as RHHCConfigProvider,
  defaultConfig as rhhcDefaultConfig,
} from 'react-helsinki-headless-cms';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import nextI18nextConfig from '../../next-i18next.config';
import LoadingSpinner from '../common/components/loadingSpinner/LoadingSpinner';
import '../assets/styles/main.scss';
import CmsPageLayout from '../domain/app/layout/CmsPageLayout';
import PageLayout from '../domain/app/layout/PageLayout';
import { getCmsArticlePath, getCmsPagePath } from '../domain/app/routes/utils';
import { store } from '../domain/app/store';
import MatomoTracker from '../domain/matomo/Matomo';
import FocusToTop from '../FocusToTop';
import { useCmsApollo } from '../headless-cms/cmsApolloClient';
import CMSApolloProvider from '../headless-cms/cmsApolloContext';
import AppConfig from '../headless-cms/config';
import { getRoutedInternalHrefForLocale } from '../headless-cms/utils';
import useLocale from '../hooks/useLocale';
import getLanguageCode from '../utils/getCurrentLanguageCode';
import '../styles/globals.scss';

const CMS_API_DOMAIN = AppConfig.cmsOrigin;
const APP_DOMAIN = AppConfig.origin;

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  });
}

const internalHrefOrigins = [APP_DOMAIN, CMS_API_DOMAIN];
export const getIsHrefExternal = (href: string) => {
  if (href?.startsWith('/')) return false;
  return !internalHrefOrigins.some((origin) => href?.includes(origin));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppProps<P = any> = {
  pageProps: P;
} & Omit<NextAppProps<P>, 'pageProps'>;

export type CustomPageProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  initialApolloState: NormalizedCacheObject;
} & SSRConfig;

const MyApp = ({ Component, pageProps }: AppProps<CustomPageProps>) => {
  const router = useRouter();
  const locale = useLocale();
  const { t } = useTranslation();
  const cmsApolloClient = useCmsApollo(pageProps.initialApolloState);

  const DynamicCookieConsentWithNoSSR = dynamic(
    () => import('../domain/cookieConsent/CookieConsent'),
    { ssr: false }
  );

  const rhhcConfig = React.useMemo(
    (): Config => ({
      ...rhhcDefaultConfig,
      siteName: t('common:appName'),
      currentLanguageCode: getLanguageCode(locale),
      copy: {
        breadcrumbNavigationLabel: t(
          'common:breadcrumb.breadcrumbNavigationLabel'
        ),
        breadcrumbListLabel: t('common:breadcrumb.breadcrumbListLabel'),
        menuToggleAriaLabel: t('common:menu.menuToggleAriaLabel'),
        menuButtonLabel: t('common:menu.menuButtonLabel'),
        skipToContentLabel: t('common:linkSkipToContent'),
        openInExternalDomainAriaLabel: t('common:srOnly.opensInAnExternalSite'),
        openInNewTabAriaLabel: t('common:srOnly.opensInANewTab'),
        closeButtonLabelText: t('common:button.close'),
        loadMoreButtonLabelText: t('cms:archiveSearch.searchButtonLabelText'),
        showAllText: t('common:button.showAll'),
        archiveSearch: {
          title: '', // t('cms:archiveSearch.title'),
          searchTextPlaceholder: t('cms:archiveSearch.searchTextPlaceholder'),
          searchButtonLabelText: t('cms:archiveSearch.searchButtonLabelText'),
          loadMoreButtonLabelText: t(
            'cms:archiveSearch.loadMoreButtonLabelText'
          ),
          noResultsText: t('cms:archiveSearch.noResultsText'),
          noResultsTitle: t('cms:archiveSearch.noResultsTitle'),
          clearAll: t('cms:archiveSearch.buttonClearFilters'),
        },
        next: t('common:button.next'),
        previous: t('common:button.previous'),
      },
      customCopy: {
        loadMoreButtonVariant: 'primary',
        loadMoreButtonTheme: 'coat',
      },
      components: {
        ...rhhcDefaultConfig.components,
        Head: (props: any) => <Head {...props} />,
        Link: ({ href, ...props }: any) => (
          <Link href={href || ''} {...props} />
        ),
        EventCardContent: (props: any) => <div>TODO: EventCardContent</div>,
        ArticleCardContent: (props: any) => <div>TODO: ArticleCardContent</div>,
        VenueCardContent: (props: any) => <div>TODO: VenueCardContent</div>,
      },
      utils: {
        ...rhhcDefaultConfig.utils,
        getIsHrefExternal,
        // this does not work anymore with
        // article type as type is never passed to the function in new hcrc implementation
        getRoutedInternalHref: (link?: string | null) =>
          getRoutedInternalHrefForLocale(locale, link),
      },
      internalHrefOrigins: CMS_API_DOMAIN ? [CMS_API_DOMAIN] : [],
      apolloClient: cmsApolloClient,
    }),
    [t, cmsApolloClient, locale]
  );
  React.useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.setAttribute('lang', locale);
    }
  }, [locale]);

  const PageLayoutComponent = [getCmsPagePath(''), getCmsArticlePath('')].some(
    (path) => router.route.startsWith(path)
  )
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

class ErrorBoundary extends React.Component<{ children?: React.ReactNode }> {
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

const Center: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
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
export default appWithTranslation(MyApp as any, nextI18nextConfig as any);
