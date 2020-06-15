import NextI18Next from 'next-i18next';

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: 'fi',
  ignoreRoutes: ['/healthz', '/readiness'],
  localeSubpaths: {
    en: 'en',
    fi: 'fi',
    sv: 'sv',
  },
  otherLanguages: ['en', 'sv'],
});

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
