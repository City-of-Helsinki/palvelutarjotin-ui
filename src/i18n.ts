import path from 'path';

import intervalPlural from 'i18next-intervalplural-postprocessor';
import NextI18Next from 'next-i18next';
import config from 'next/config';

const { publicRuntimeConfig } = config();

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: 'fi',
  ignoreRoutes: ['/healthz', '/readiness', '/_next', '/static', '/favicon.ico'],
  localeSubpaths: publicRuntimeConfig.localeSubpaths,
  otherLanguages: ['en', 'sv'],
  localePath: path.resolve('./public/static/locales'),
});

NextI18NextInstance.i18n.use(intervalPlural);

export default NextI18NextInstance;

/* Optionally, export class methods as named exports */
export const {
  appWithTranslation,
  i18n,
  Link,
  Router,
  useTranslation,
  withTranslation,
} = NextI18NextInstance;
