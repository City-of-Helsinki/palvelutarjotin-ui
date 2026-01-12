import { ApolloProvider } from '@apollo/client';
import { ConfigProvider as RHHCConfigProvider } from '@city-of-helsinki/react-helsinki-headless-cms';
import { CookieConsentContextProvider } from 'hds-react';
import dynamic from 'next/dynamic';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import { appWithTranslation, UserConfig, useTranslation } from 'next-i18next';
import React from 'react';
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
import MatomoTracker from '../domain/matomo/Matomo';
import FocusToTop from '../FocusToTop';
import useLocale from '../hooks/useLocale';
import type { AppProps, CustomPageProps, I18nNamespace } from '../types';
import '../styles/globals.scss';

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

  // Configure cookie consent groups
  const cookieConsentSiteSettings = React.useMemo(
    () => ({
      cookieName: 'city-of-helsinki-cookie-consents',
      siteName: t('common:appName'),
      currentLanguage: locale,
      languages: [
        { code: 'fi', label: 'Suomeksi' },
        { code: 'sv', label: 'På svenska' },
        { code: 'en', label: 'In English' },
      ],
      fallbackLanguage: 'fi',
      requiredGroups: [
        {
          groupId: 'essential',
          title: t('common:consent.required.title'),
          description: t('common:consent.required.text'),
          cookies: [
            {
              name: 'city-of-helsinki-cookie-consents',
              host:
                typeof window !== 'undefined' ? window.location.hostname : '',
              description: t('common:consent.cookies.cookieConsent'),
              expiration: t('common:consent.expiration.year'),
              storageType: 1,
            },
            {
              name: 'wordpress_*, wp-settings-*',
              host: 'api.hel.fi',
              description: t('common:consent.cookies.wordpress'),
              expiration: t('common:consent.expiration.session'),
              storageType: 1,
            },
            {
              name: 'linkedevents-api-prod-csrftoken',
              host: 'api.hel.fi',
              description: t('common:consent.cookies.linkedevents'),
              expiration: t('common:consent.expiration.year'),
              storageType: 1,
            },
            {
              name: 'i18next',
              host:
                typeof window !== 'undefined' ? window.location.hostname : '',
              description: t('common:consent.cookies.i18next'),
              expiration: t('common:consent.expiration.session'),
              storageType: 2,
            },
          ],
        },
      ],
      optionalGroups: [
        {
          groupId: 'statistics',
          title: t('common:consent.groups.matomo.title'),
          description: t('common:consent.groups.matomo.text'),
          cookies: [
            {
              name: '_pk*',
              host: 'digia.fi',
              description: t('common:consent.cookies.matomo'),
              expiration: t('common:consent.expiration.days', { days: 393 }),
              storageType: 1,
            },
          ],
        },
      ],
      translations: {
        bannerAriaLabel: t('common:consent.translations.bannerAriaLabel'),
        heading: t('common:consent.translations.heading', {
          siteName: t('common:appName'),
        }),
        description: t('common:consent.texts.sections.main.text'),
        showDetails: t('common:consent.translations.showDetails'),
        hideDetails: t('common:consent.texts.ui.hideSettings'),
        formHeading: t('common:consent.translations.formHeading'),
        formText: t('common:consent.translations.formText'),
        showCookieSettings: t('common:consent.translations.showCookieSettings'),
        hideCookieSettings: t('common:consent.texts.ui.hideSettings'),
        tableHeadingsName: t('common:consent.translations.tableHeadingsName'),
        tableHeadingsHostName: t(
          'common:consent.translations.tableHeadingsHostName'
        ),
        tableHeadingsDescription: t(
          'common:consent.translations.tableHeadingsDescription'
        ),
        tableHeadingsExpiration: t(
          'common:consent.translations.tableHeadingsExpiration'
        ),
        tableHeadingsType: t('common:consent.translations.tableHeadingsType'),
        approveAllConsents: t('common:consent.translations.approveAllConsents'),
        approveRequiredAndSelectedConsents: t(
          'common:consent.translations.approveRequiredAndSelectedConsents'
        ),
        approveOnlyRequiredConsents: t(
          'common:consent.texts.ui.approveOnlyRequiredConsents'
        ),
        settingsSaved: t('common:consent.translations.settingsSaved'),
        highlightedGroup: t('common:consent.translations.highlightedGroup'),
        highlightedGroupAria: t(
          'common:consent.translations.highlightedGroupAria'
        ),
        acceptedAt: t('common:consent.translations.acceptedAt'),
        storageType1: t('common:consent.translations.storageType1'),
        storageType2: t('common:consent.translations.storageType2'),
        storageType3: t('common:consent.translations.storageType3'),
        storageType4: t('common:consent.translations.storageType4'),
        storageType5: t('common:consent.translations.storageType5'),
      },
      language: {
        onLanguageChange: (newLang: string) => {
          router.push(router.pathname, router.asPath, { locale: newLang });
        },
      },
    }),
    [t, locale, router]
  );

  React.useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.setAttribute('lang', locale);
    }
  }, [locale]);

  return (
    <ErrorBoundary>
      <RHHCConfigProvider config={rhhcConfig}>
        <ApolloProvider client={apolloClient}>
          <CookieConsentContextProvider
            siteSettings={cookieConsentSiteSettings}
          >
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
                <PageLayoutComponent {...pageProps}>
                  <Component {...pageProps} />
                  <DynamicCookieConsentWithNoSSR />
                </PageLayoutComponent>
              )}
              <ToastContainer position="top-right" />
            </MatomoTracker>
          </CookieConsentContextProvider>
        </ApolloProvider>
      </RHHCConfigProvider>
    </ErrorBoundary>
  );
};

export default appWithTranslation(MyApp, nextI18nextConfig as UserConfig);
