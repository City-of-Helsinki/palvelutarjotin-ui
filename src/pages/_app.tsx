import * as Sentry from '@sentry/browser';
import { Header, HeaderCustomTheme, Tabs, TabsCustomTheme } from 'hds-react';
import type { AppProps as NextAppProps } from 'next/app';
import { SSRConfig } from 'next-i18next';
import React, { memo } from 'react';

import '../assets/styles/main.scss';
import AppConfig from '../headless-cms/config';

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

const isClient = typeof window !== 'undefined';

const MyApp = ({ Component }: any) => {
  console.log('Now rendering MyApp', { isClient });
  return <Component />;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default MyApp;
