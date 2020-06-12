import NextI18Next from 'next-i18next';

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: 'fi',
  localePath: 'src/locales',
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
  useTranslation,
  withTranslation,
} = NextI18NextInstance;
