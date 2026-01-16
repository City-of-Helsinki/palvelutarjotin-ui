import {
  Language,
  LanguageCodeEnum,
} from '@city-of-helsinki/react-helsinki-headless-cms';

/**
 * This is just a mock of list of Languages.
 * The react-helsinki-headless-cms needs typeof `Language[]` in a list of lanugages,
 * and at least the current language must present in the list.
 * The error page should not fetch langauges by using the Apollo client,
 * because the network error in the Apollo client is
 * usually the reason to show the error page.
 */
export const HARDCODED_LANGUAGES: Language[] = [
  {
    __typename: 'Language',
    id: 'TGFuZ3VhZ2U6Zmk=',
    locale: 'fi',
    name: 'Suomi',
    code: LanguageCodeEnum.Fi,
    slug: 'fi',
  },
  {
    __typename: 'Language',
    id: 'TGFuZ3VhZ2U6ZW4=',
    locale: 'en',
    name: 'English',
    code: LanguageCodeEnum.En,
    slug: 'en',
  },
  {
    __typename: 'Language',
    id: 'TGFuZ3VhZ2U6c3Y=',
    locale: 'sv',
    name: 'Svenska',
    code: LanguageCodeEnum.Sv,
    slug: 'sv',
  },
];
