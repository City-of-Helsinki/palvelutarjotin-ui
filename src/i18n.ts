import intervalPlural from 'i18next-intervalplural-postprocessor';
import NextI18Next from 'next-i18next';

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: 'fi',
  ignoreRoutes: ['/healthz', '/readiness', '/_next', '/static', '/favicon.ico'],
  localeSubpaths: {
    en: 'en',
    fi: 'fi',
    sv: 'sv',
  },
  otherLanguages: ['en', 'sv'],
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
