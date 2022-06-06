import * as Sentry from '@sentry/browser';
import { LoadingSpinner } from 'hds-react';
import { appWithTranslation, useTranslation } from 'next-i18next';
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
import { getCmsArticlePath, getCmsPagePath } from '../domain/app/routes/utils';
import { store } from '../domain/app/store';
import MatomoTracker from '../domain/matomo/Matomo';
import FocusToTop from '../FocusToTop';
import { LanguageCodeEnum } from '../generated/graphql-cms';
import { useCmsApollo } from '../headless-cms/cmsApolloClient';
import CMSApolloProvider from '../headless-cms/cmsApolloContext';
import { getRoutedInternalHref } from '../headless-cms/utils';
import useLocale from '../hooks/useLocale';

const CMS_API_DOMAIN = process.env.NEXT_PUBLIC_CMS_BASE_URL
  ? new URL(process.env.NEXT_PUBLIC_CMS_BASE_URL).origin
  : null;

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  });
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const locale = useLocale();
  const { t } = useTranslation();
  const cmsApolloClient = useCmsApollo(pageProps.initialApolloState);
  const rhhcConfig = React.useMemo(
    () => ({
      ...rhhcDefaultConfig,
      siteName: t('common:appName'),
      currentLanguageCode: LanguageCodeEnum.Fi,
      copy: {
        breadcrumbNavigationLabel: t(
          'common:breadcrumb.breadcrumbNavigationLabel'
        ),
        breadcrumbListLabel: t('common:breadcrumb.breadcrumbListLabel'),
        menuToggleAriaLabel: t('common:menu.toggle'),
        skipToContentLabel: t('common:linkSkipToContent'),
        openInExternalDomainAriaLabel: t('common:srOnly.opensInAnExternalSite'),
        openInNewTabAriaLabel: t('common:srOnly.opensInANewTab'),
        closeButtonLabelText: t('common:button.close'),
        archiveSearch: {
          searchTextPlaceholder: t('cms:archiveSearch.searchTextPlaceholder'),
          searchButtonLabelText: t('cms:archiveSearch.searchButtonLabelText'),
          loadMoreButtonLabelText: t(
            'cms:archiveSearch.loadMoreButtonLabelText'
          ),
          noResultsText: t('cms:archiveSearch.noResultsText'),
        },
      },
      utils: {
        ...rhhcDefaultConfig.utils,
        getIsHrefExternal: (href: string) => {
          if (
            !href?.includes(router.basePath) ||
            (CMS_API_DOMAIN && !href?.includes(CMS_API_DOMAIN))
          ) {
            return true;
          }
          return false;
        },
        getRoutedInternalHref,
      },
      internalHrefOrigins: CMS_API_DOMAIN ? [CMS_API_DOMAIN] : [],
    }),
    [router.basePath, t]
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
