import type { NormalizedCacheObject } from '@apollo/client';
import type { AppProps as NextAppProps } from 'next/app';
import { SSRConfig } from 'next-i18next';

import { ALL_I18N_NAMESPACES } from './constants';

export type OptionType = {
  label: string;
  value: string;
};

export type I18nNamespace = (typeof ALL_I18N_NAMESPACES)[number];

export type Language = 'en' | 'fi' | 'sv';

export type ApolloProps = {
  initialApolloState: NormalizedCacheObject | null;
  initialCMSApolloState: NormalizedCacheObject | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppProps<P = any> = {
  pageProps: P;
} & Omit<NextAppProps<P>, 'pageProps'>;

export type CustomPageProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
} & SSRConfig &
  ApolloProps;
