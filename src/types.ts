import type { NormalizedCacheObject } from '@apollo/client';
import type { AppProps as NextAppProps } from 'next/app';

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

type TranslationValue = string | { [key: string]: TranslationValue };

export type SSRConfig = {
  _nextI18Next?: {
    initialI18nStore: Record<string, Record<string, TranslationValue>>;
    initialLocale: string;
    ns: string[];
    userConfig: null;
  };
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
