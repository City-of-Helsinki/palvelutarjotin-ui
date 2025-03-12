import type { NormalizedCacheObject } from '@apollo/client';
import type { AppProps as NextAppProps } from 'next/app';
import { SSRConfig } from 'next-i18next';

import rootReducer from './domain/app/reducers';

export type OptionType = {
  label: string;
  value: string;
};

export type Language = 'en' | 'fi' | 'sv';

export type RootState = ReturnType<typeof rootReducer>;

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
