import { NormalizedCacheObject } from '@apollo/client';
import * as Sentry from '@sentry/browser';
import type { AppProps as NextAppProps } from 'next/app';
import NextError from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { appWithTranslation, SSRConfig, useTranslation } from 'next-i18next';
import React, { ErrorInfo } from 'react';
import {
  Config,
  LanguageCodeEnum,
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
import CookieConsent from '../domain/cookieConsent/CookieConsent';
import MatomoTracker from '../domain/matomo/Matomo';
import FocusToTop from '../FocusToTop';
import { useCmsApollo } from '../headless-cms/cmsApolloClient';
import CMSApolloProvider from '../headless-cms/cmsApolloContext';
import AppConfig from '../headless-cms/config';
import { stripLocaleFromUri } from '../headless-cms/utils';
import useLocale from '../hooks/useLocale';
import getLanguageCode from '../utils/getCurrentLanguageCode';
import { Header, Tabs } from 'hds-react';

const CMS_API_DOMAIN = AppConfig.cmsOrigin;
const APP_DOMAIN = AppConfig.origin;

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  });
}

const internalHrefOrigins = [APP_DOMAIN, CMS_API_DOMAIN];
const getIsHrefExternal = (href: string) => {
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
} & SSRConfig;

const MyApp = ({ Component, pageProps }: AppProps<CustomPageProps>) => {
  const theme = {
    '--color-focus-outline': 'var(--color-metro-dark)',
    '--header-color': 'var(--color-black)',
    '--header-max-width': '1220px',
    '--header-focus-outline-color': 'var(--color-metro-dark)',
    '--actionbar-background-color': 'var(--color-engel)',
    '--nav-background-color': 'var(--color-engel-light)',
    '--nav-mobile-menu-background-color': 'var(--color-engel-light)',
    '--nav-border-color': 'var(--color-black)',
    '--nav-link-hover-color': 'var(--color-black)',
    '--universal-bar-background-color': 'var(--color-black-20)',
    '--nav-link-dropdown-background-color': 'var(--color-engel-light)',
    '--nav-button-background-color': 'var(--color-black-20)',
    '--nav-button-hover-background-color': 'var(--color-black-40)',
    '--nav-drop-down-icon-color': 'var(--color-black)',
    '--header-background-color': 'var(--color-engel-light)',
    '--logo-height': '50px',
  };

  const theme2 = {
    '--tab-color': 'var(--color-black-90)',
    '--tab-active-border-color': 'var(--color-metro)',
  };

  return (
    <>
      <Tabs theme={theme2}>
        <Tabs.TabList className="example-tablist">
          <Tabs.Tab>Daycar1111e</Tabs.Tab>
          <Tabs.Tab>Pre-school</Tabs.Tab>
          <Tabs.Tab>Basic education</Tabs.Tab>
          <Tabs.Tab>Upper secondary</Tabs.Tab>
          <Tabs.Tab>University</Tabs.Tab>
        </Tabs.TabList>

        <Tabs.TabPanel>
          A pre-school is an educational establishment offering early childhood
          education to children before they begin compulsory education at
          primary school.
        </Tabs.TabPanel>
      </Tabs>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default MyApp;
