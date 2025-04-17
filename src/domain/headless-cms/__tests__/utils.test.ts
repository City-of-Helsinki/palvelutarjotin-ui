import { ParsedUrlQuery } from 'querystring';

import isEqual from 'lodash/isEqual';
import { graphql, HttpResponse } from 'msw';
import { LanguageCodeEnum, MenuItem } from 'react-helsinki-headless-cms';
import {
  MenuQuery,
  MenuQueryVariables,
} from 'react-helsinki-headless-cms/apollo';

import {
  allMockedMenuPages,
  menuQueryMocks,
} from '../../../tests/apollo-mocks/menuMocks';
import { server } from '../../../tests/msw/server';
import { Language } from '../../../types';
import AppConfig from '../config';
import {
  getUriID,
  stripLocaleFromUri,
  getAllMenuPages,
  getSlugFromUri,
  removeTrailingSlash,
  slugsToUriSegments,
  uriToBreadcrumbs,
  isInternalHrefCmsPage,
  getRoutedInternalHrefForLocale,
  rewriteInternalURLs,
  getIsItemActive,
  getLocalizedCmsItemUrl,
  getCmsHref,
  getHrefForNonCmsPage,
} from '../utils';

// Mock window.location for getIsItemActive tests
const originalLocation = window.location;
const mockLocation = (pathname: string) => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { ...originalLocation, pathname },
  });
};

afterEach(() => {
  // Restore original window.location after each test
  Object.defineProperty(window, 'location', {
    writable: true,
    value: originalLocation,
  });
});

describe('getUriID', () => {
  test.each<{ slugs: string[]; locale: Language; expected: string }>([
    {
      slugs: ['slug1'],
      locale: 'en',
      expected: '/en/slug1/',
    },
    {
      slugs: ['slug1'],
      locale: 'fi',
      expected: '/slug1/',
    },
    {
      slugs: ['slug1', 'slug2'],
      locale: 'fi',
      expected: '/slug1/slug2/',
    },
    {
      slugs: ['slug1', 'slug2', 'slug3'],
      locale: 'fi',
      expected: '/slug1/slug2/slug3/',
    },

    {
      slugs: ['slug1', 'slug2', 'slug3'],
      locale: 'en',
      expected: '/en/slug1/slug2/slug3/',
    },
    {
      slugs: ['slug1', 'slug2', 'slug3'],
      locale: 'sv',
      expected: '/sv/slug1/slug2/slug3/',
    },
  ])(
    'getUriID($slugs, $locale) returns $expected',
    ({ slugs, locale, expected }) => {
      expect(getUriID(slugs, locale)).toBe(expected);
    }
  );
});

describe('stripLocaleFromUri', () => {
  test.each([
    {
      uri: '/en/ensdgfdsd/',
      expected: '/ensdgfdsd/',
    },
    {
      uri: '/en/ensdgfdsd/slug',
      expected: '/ensdgfdsd/slug',
    },
    {
      uri: '/svaasdfgds/',
      expected: '/svaasdfgds/',
    },
    {
      uri: '/fi/slug1',
      expected: '/slug1',
    },
    {
      uri: '/sv/slug1/',
      expected: '/slug1/',
    },
    {
      uri: '/sv1/slug1/',
      expected: '/sv1/slug1/',
    },
    {
      uri: '/fiI/slug1/',
      expected: '/fiI/slug1/',
    },
    {
      uri: '/fi10/slug1/',
      expected: '/fi10/slug1/',
    },
  ])('stripLocaleFromUri("$uri") returns $expected', ({ uri, expected }) => {
    expect(stripLocaleFromUri(uri)).toBe(expected);
  });
});

describe('getSlugFromUri', () => {
  test.each([
    {
      uri: '/slug1/',
      expected: ['slug1'],
    },
    {
      uri: '/slug1/slug2/slug3',
      expected: ['slug1', 'slug2', 'slug3'],
    },
    {
      uri: '/fi/slug1/',
      expected: ['slug1'],
    },
    {
      uri: '/en/slug1/',
      expected: ['slug1'],
    },
    {
      uri: '/sv/slug1/',
      expected: ['slug1'],
    },
    {
      uri: '/sva/slug1/',
      expected: ['sva', 'slug1'],
    },
    {
      uri: '/sva////slug1/',
      expected: ['sva', 'slug1'],
    },
  ])('getSlugFromUri($uri) returns $expected', ({ uri, expected }) => {
    expect(getSlugFromUri(uri)).toEqual(expected);
  });
});

describe('removeTrailingSlash', () => {
  test.each([
    {
      uri: '/moi/',
      expected: '/moi',
    },
    {
      uri: '/slug1/slug2/',
      expected: '/slug1/slug2',
    },
  ])('removeTrailingSlash("$uri") returns $expected', ({ uri, expected }) => {
    expect(removeTrailingSlash(uri)).toBe(expected);
  });
});

describe('slugsToUriSegments', () => {
  test.each([
    {
      slugs: [],
      expected: [],
    },
    {
      slugs: ['slug1'],
      expected: ['/slug1/'],
    },
    {
      slugs: ['slug1', 'slug2'],
      expected: ['/slug1/', '/slug1/slug2/'],
    },
    {
      slugs: ['slug1', 'slug2', 'slug3'],
      expected: ['/slug1/', '/slug1/slug2/', '/slug1/slug2/slug3/'],
    },
  ])('slugsToUriSegments("$uri") returns $expected', ({ slugs, expected }) => {
    expect(slugsToUriSegments(slugs)).toEqual(expected);
  });
});

describe('uriToBreadcrumbs', () => {
  test.each([
    {
      uri: '',
      expected: [],
    },
    {
      uri: '/slug1/',
      expected: ['/slug1/'],
    },
    {
      uri: '/slug1/slug2/',
      expected: ['/slug1/', '/slug1/slug2/'],
    },
    {
      uri: '/slug1/slug2/slug3/',
      expected: ['/slug1/', '/slug1/slug2/', '/slug1/slug2/slug3/'],
    },
    {
      uri: '/slug1/slug2/slug3/slug4/',
      expected: [
        '/slug1/',
        '/slug1/slug2/',
        '/slug1/slug2/slug3/',
        '/slug1/slug2/slug3/slug4/',
      ],
    },
  ])('uriToBreadcrumbs("$uri") returns $expected', ({ uri, expected }) => {
    expect(uriToBreadcrumbs(uri)).toEqual(expected);
  });
});

describe('getAllMenuPages', () => {
  it('fetches all unique pages in all languages', async () => {
    server.use(
      graphql.query<MenuQuery, MenuQueryVariables>('menu', ({ variables }) => {
        const data = menuQueryMocks.find(({ variables: mockVariables }) => {
          return isEqual(mockVariables, variables);
        });
        return HttpResponse.json({
          data: data?.response ?? {},
        });
      })
    );

    const pages = await getAllMenuPages();
    expect(pages).toHaveLength(allMockedMenuPages.length);
    expect(pages).toStrictEqual(allMockedMenuPages);
  });
});

describe('getRoutedInternalHrefForLocale', () => {
  test.each<{ locale: Language; link?: string | null; expected: string }>([
    // English locale with CMS page
    { locale: 'en', link: '/slug1', expected: '/en/cms-page/slug1' },
    { locale: 'en', link: '/slug1/', expected: '/en/cms-page/slug1' },
    { locale: 'en', link: '/en/slug1', expected: '/en/cms-page/slug1' },
    { locale: 'en', link: '/fi/slug1', expected: '/en/cms-page/slug1' },
    { locale: 'en', link: '/sv/slug1', expected: '/en/cms-page/slug1' },
    { locale: 'en', link: '/en/slug1/', expected: '/en/cms-page/slug1' },
    { locale: 'en', link: '/fi/slug1/', expected: '/en/cms-page/slug1' },
    { locale: 'en', link: '/sv/slug1/', expected: '/en/cms-page/slug1' },
    // Swedish locale with CMS page
    { locale: 'sv', link: '/slug1', expected: '/sv/cms-page/slug1' },
    { locale: 'sv', link: '/slug1/', expected: '/sv/cms-page/slug1' },
    { locale: 'sv', link: '/en/slug1', expected: '/sv/cms-page/slug1' },
    { locale: 'sv', link: '/fi/slug1', expected: '/sv/cms-page/slug1' },
    { locale: 'sv', link: '/sv/slug1', expected: '/sv/cms-page/slug1' },
    { locale: 'sv', link: '/en/slug1/', expected: '/sv/cms-page/slug1' },
    { locale: 'sv', link: '/fi/slug1/', expected: '/sv/cms-page/slug1' },
    { locale: 'sv', link: '/sv/slug1/', expected: '/sv/cms-page/slug1' },
    // Finnish locale (special case) with CMS page
    { locale: 'fi', link: '/slug1', expected: '/cms-page/slug1' },
    { locale: 'fi', link: '/slug1/', expected: '/cms-page/slug1' },
    { locale: 'fi', link: '/en/slug1', expected: '/cms-page/slug1' },
    { locale: 'fi', link: '/fi/slug1', expected: '/cms-page/slug1' },
    { locale: 'fi', link: '/sv/slug1', expected: '/cms-page/slug1' },
    { locale: 'fi', link: '/en/slug1/', expected: '/cms-page/slug1' },
    { locale: 'fi', link: '/fi/slug1/', expected: '/cms-page/slug1' },
    { locale: 'fi', link: '/sv/slug1/', expected: '/cms-page/slug1' },
    // English locale with known non-CMS pages
    { locale: 'en', link: '/newsletter', expected: '/en/newsletter' },
    { locale: 'en', link: '/newsletter/', expected: '/en/newsletter' },
    { locale: 'en', link: '', expected: '/en' },
    { locale: 'en', link: '/', expected: '/en' },
    { locale: 'en', link: '/search', expected: '/en/search' },
    { locale: 'en', link: '/search/', expected: '/en/search' },
    // Swedish locale with known non-CMS pages
    { locale: 'sv', link: '/newsletter', expected: '/sv/newsletter' },
    { locale: 'sv', link: '/newsletter/', expected: '/sv/newsletter' },
    { locale: 'sv', link: '', expected: '/sv' },
    { locale: 'sv', link: '/', expected: '/sv' },
    { locale: 'sv', link: '/search', expected: '/sv/search' },
    { locale: 'sv', link: '/en/search/', expected: '/sv/search' },
    // Finnish locale (special case) with known non-CMS pages
    { locale: 'fi', link: '/en/newsletter/', expected: '/newsletter' },
    { locale: 'fi', link: '/en/newsletter/', expected: '/newsletter' },
    { locale: 'fi', link: '', expected: '/' },
    { locale: 'fi', link: '/', expected: '/' },
    { locale: 'fi', link: '/en/search', expected: '/search' },
    { locale: 'fi', link: '/search/', expected: '/search' },
  ])(
    'getRoutedInternalHrefForLocale($locale, $link) returns $expected',
    ({ locale, link, expected }) => {
      expect(getRoutedInternalHrefForLocale(locale, link)).toBe(expected);
    }
  );
});

describe('isInternalHrefCmsPage', () => {
  test.each<{ link?: string | null; expected: boolean }>([
    { link: '/slug1', expected: true },
    { link: '/slug1/', expected: true },
    { link: '/en/slug1', expected: true },
    { link: '/fi/slug1', expected: true },
    { link: '/sv/slug1', expected: true },
    { link: '/sv/slug1/', expected: true },
    // /newsletter/ is not a CMS page
    { link: '/newsletter', expected: false },
    { link: '/newsletter/', expected: false },
    { link: '/en/newsletter', expected: false },
    { link: '/en/newsletter/', expected: false },
    { link: '/fi/newsletter', expected: false },
    { link: '/fi/newsletter/', expected: false },
    { link: '/sv/newsletter', expected: false },
    { link: '/sv/newsletter/', expected: false },
    // /search/ is not a CMS page
    { link: '/search', expected: false },
    { link: '/search/', expected: false },
    { link: '/en/search', expected: false },
    { link: '/en/search/', expected: false },
    { link: '/fi/search', expected: false },
    { link: '/fi/search/', expected: false },
    { link: '/sv/search', expected: false },
    { link: '/sv/search/', expected: false },
    // root is not a CMS page
    { link: '', expected: false },
    { link: '/', expected: false },
  ])('isInternalHrefCmsPage($link) returns $expected', ({ link, expected }) => {
    expect(isInternalHrefCmsPage(link)).toBe(expected);
  });
});

describe('rewriteInternalURLs', () => {
  test.each([
    {
      source: { link: 'https://kultus.content.api.hel.fi/fi/' },
      target: { link: '/fi/cms-page/' },
    },
    {
      source: { link: 'https://kultus.content.api.hel.fi/sv/' },
      target: { link: '/sv/cms-page/' },
    },
    {
      source: { link: 'https://kultus.content.api.hel.fi/en/' },
      target: { link: '/en/cms-page/' },
    },
    {
      source: { link: 'https://kultus.content.api.hel.fi/fi/asdas/asdas' },
      target: { link: '/fi/cms-page/asdas/asdas' },
    },
    {
      source: { link: 'https://kultus.content.api.hel.fi/fi/something/' },
      target: { link: '/fi/cms-page/something/' },
    },
    {
      source: { link: 'https://kultus.content.api.hel.fi/fi/something/more' },
      target: { link: '/fi/cms-page/something/more' },
    },
    {
      source: {
        link: 'https://kultus.content.api.hel.fi/oppimateriaalit/alakoulu/',
      },
      target: { link: '/cms-page/oppimateriaalit/alakoulu/' },
    },
    {
      source: { link: 'https://kultus.content.api.hel.fi/oppimateriaalit/' },
      target: { link: '/cms-page/oppimateriaalit/' },
    },
    {
      source: {
        // eslint-disable-next-line max-len
        link: 'https://kultus.content.api.hel.fi/oppimateriaalit/alakoulu/mediakasvatuksen-oppimateriaalit-huippula-palvelussa/',
      },
      target: {
        link: '/cms-page/oppimateriaalit/alakoulu/mediakasvatuksen-oppimateriaalit-huippula-palvelussa/',
      },
    },
  ])('rewriteInternalURLs($source) returns $target', ({ source, target }) => {
    jest
      .spyOn(AppConfig, 'cmsOrigin', 'get')
      .mockReturnValue('https://kultus.content.api.hel.fi');
    expect(rewriteInternalURLs(source)).toStrictEqual(target);
  });

  test.each([
    {
      link: 'https://kultus.content.api.hel.fi/app/images',
    },
    {
      link: 'https://kultus.content.api.hel.fi/app/pictures',
    },
    {
      link: 'https://kultus.content.api.hel.fi/app/files',
    },
  ])('rewriteInternalURLs should not rewrite $link', (source) => {
    jest
      .spyOn(AppConfig, 'cmsOrigin', 'get')
      .mockReturnValue('https://kultus.content.api.hel.fi');
    expect(rewriteInternalURLs(source)).toStrictEqual(source);
  });
});

describe('getIsItemActive', () => {
  const menuItem: MenuItem = {
    id: '1',
    order: 1,
    target: null,
    label: 'Test Item',
    path: '/test-page/', // Example path from CMS
    parentId: null,
    connectedNode: null,
  };

  test.each<{
    locale: string;
    currentPath: string;
    itemPath: string | null | undefined;
    expected: boolean;
    description: string;
  }>([
    // Finnish (no locale prefix)
    {
      locale: 'fi',
      currentPath: '/cms-page/test-page',
      itemPath: '/test-page/',
      expected: true,
      description: 'FI: Exact match',
    },
    {
      locale: 'fi',
      currentPath: '/cms-page/test-page/sub-page',
      itemPath: '/test-page/',
      expected: true,
      description: 'FI: Current path is sub-path',
    },
    {
      locale: 'fi',
      currentPath: '/cms-page/another-page',
      itemPath: '/test-page/',
      expected: false,
      description: 'FI: Different page',
    },
    {
      locale: 'fi',
      currentPath: '/cms-page/test-page',
      itemPath: '/fi/test-page/',
      expected: true,
      description: 'FI: Item path has locale prefix (should be stripped)',
    },
    // English
    {
      locale: 'en',
      currentPath: '/en/cms-page/test-page',
      itemPath: '/test-page/',
      expected: true,
      description: 'EN: Exact match',
    },
    {
      locale: 'en',
      currentPath: '/en/cms-page/test-page/sub-page',
      itemPath: '/test-page/',
      expected: true,
      description: 'EN: Current path is sub-path',
    },
    {
      locale: 'en',
      currentPath: '/en/cms-page/another-page',
      itemPath: '/test-page/',
      expected: false,
      description: 'EN: Different page',
    },
    {
      locale: 'en',
      currentPath: '/en/cms-page/test-page',
      itemPath: '/en/test-page/',
      expected: true,
      description: 'EN: Item path has locale prefix (should be stripped)',
    },
    // Swedish
    {
      locale: 'sv',
      currentPath: '/sv/cms-page/test-page',
      itemPath: '/test-page/',
      expected: true,
      description: 'SV: Exact match',
    },
    // Edge cases
    {
      locale: 'fi',
      currentPath: '/cms-page/test-page',
      itemPath: null,
      expected: false,
      description: 'Null item path',
    },
    {
      locale: 'fi',
      currentPath: '/cms-page/test-page',
      itemPath: undefined,
      expected: false,
      description: 'Undefined item path',
    },
    {
      locale: 'fi',
      currentPath: '/cms-page/root',
      itemPath: '/',
      expected: true,
      description: 'Root path item',
    },
  ])(
    'getIsItemActive returns $expected for $description',
    ({ locale, currentPath, itemPath, expected }) => {
      mockLocation(currentPath);
      // Use the mock getCmsPagePath or ensure the real one is available
      const item = { ...menuItem, path: itemPath };

      // Assertion on the function's behavior
      expect(getIsItemActive(item, locale)).toBe(expected);
    }
  );

  it('should return false when window is undefined (SSR environment)', () => {
    const windowSpy = jest.spyOn(global as any, 'window', 'get');
    windowSpy.mockReturnValue(undefined);

    expect(getIsItemActive(menuItem, 'fi')).toBe(false);

    windowSpy.mockRestore(); // Clean up the mock
  });
});

describe('getLocalizedCmsItemUrl', () => {
  test.each<{
    pathname: string;
    query: ParsedUrlQuery;
    language: LanguageCodeEnum;
    expected: string;
    description: string;
  }>([
    {
      pathname: '/path/to/page',
      query: {},
      language: LanguageCodeEnum.Fi,
      expected: '/fi/path/to/page',
      description: 'FI: No query',
    },
    {
      pathname: '/path/to/page',
      query: { key: 'value' },
      language: LanguageCodeEnum.En,
      expected: '/en/path/to/page?key=value',
      description: 'EN: With query',
    },
    {
      pathname: '/another/page',
      query: { a: '1', b: '2' },
      language: LanguageCodeEnum.Sv,
      expected: '/sv/another/page?a=1&b=2',
      description: 'SV: Multiple query params',
    },
    {
      pathname: '/',
      query: {},
      language: LanguageCodeEnum.Fi,
      expected: '/fi/',
      description: 'FI: Root path',
    },
    {
      pathname: '/UPPER/CASE',
      query: {},
      language: LanguageCodeEnum.En,
      expected: '/en/UPPER/CASE', // Expect same case level
      description: 'EN: Uppercase path input',
    },
  ])(
    'getLocalizedCmsItemUrl returns $expected for $description',
    ({ pathname, query, language, expected }) => {
      // Inject the mock or use the real stringifyUrlObject
      const result = getLocalizedCmsItemUrl(pathname, query, language);
      expect(result).toBe(expected);
    }
  );
});

describe('getCmsHref', () => {
  const languageOptions = [
    { uri: '/fi/sivu', locale: 'fi' },
    { uri: '/en/page', locale: 'en' },
    { uri: '/sv/sida', locale: 'sv' },
    { uri: '/fi/toinen-sivu', locale: 'fi' }, // Duplicate locale to test find
    { uri: null, locale: 'fr' }, // Null URI
    { uri: '/es/pagina', locale: undefined }, // Undefined locale
  ];

  test.each<{
    language: LanguageCodeEnum;
    options: typeof languageOptions;
    expected: string;
    description: string;
  }>([
    {
      language: LanguageCodeEnum.Fi,
      options: languageOptions,
      expected: '/fi/cms-page/sivu', // Assumes getCmsPagePath adds /cms-page/
      description: 'FI: Found',
    },
    {
      language: LanguageCodeEnum.En,
      options: languageOptions,
      expected: '/en/cms-page/page',
      description: 'EN: Found',
    },
    {
      language: LanguageCodeEnum.Sv,
      options: languageOptions,
      expected: '/sv/cms-page/sida',
      description: 'SV: Found',
    },
    {
      language: LanguageCodeEnum.Fi,
      options: [{ uri: '/fi/UPPER', locale: 'FI' }], // Uppercase locale
      expected: '/fi/cms-page/UPPER', // Expect same case level in pathname except in locale
      description: 'FI: Uppercase locale in options',
    },
    {
      language: LanguageCodeEnum.Fi,
      options: [], // Empty options array
      expected: '/fi',
      description: 'FI: Empty options',
    },
  ])(
    'getCmsHref returns $expected for $description',
    ({ language, options, expected }) => {
      // Ensure mocks are used if real functions aren't available
      expect(getCmsHref(language, options)).toBe(expected);
    }
  );
});

describe('getHrefForNonCmsPage', () => {
  // This function directly uses getLocalizedCmsItemUrl, so tests are similar
  // We mainly test that it passes arguments correctly

  test.each<{
    pathname: string;
    query: ParsedUrlQuery;
    language: LanguageCodeEnum;
    expected: string;
    description: string;
  }>([
    {
      pathname: '/search',
      query: { q: 'test' },
      language: LanguageCodeEnum.Fi,
      expected: '/fi/search?q=test',
      description: 'FI: Search page',
    },
    {
      pathname: '/newsletter',
      query: {},
      language: LanguageCodeEnum.En,
      expected: '/en/newsletter',
      description: 'EN: Newsletter page',
    },
    {
      pathname: '/UPPER/PAGE',
      query: {},
      language: LanguageCodeEnum.Sv,
      expected: '/sv/UPPER/PAGE', // Expect same case level
      description: 'SV: Uppercase path',
    },
    {
      pathname: '/search',
      query: {
        text: 'satutuokio',
        date: '2025-04-13T21:00:00.000Z',
        endDate: '2027-04-05T21:00:00.000Z',
        inLanguage: ['en', 'fi', 'sv'],
        places: 'tprek:8324',
        targetGroups: 'kultus:51',
        categories: 'kultus:18',
        additionalCriteria: 'kultus:4',
      },
      language: LanguageCodeEnum.Fi,
      expected:
        // expect locale added and parameters in alphabetical order
        // eslint-disable-next-line max-len
        '/fi/search?additionalCriteria=kultus%3A4&categories=kultus%3A18&date=2025-04-13T21%3A00%3A00.000Z&endDate=2027-04-05T21%3A00%3A00.000Z&inLanguage=en&inLanguage=fi&inLanguage=sv&places=tprek%3A8324&targetGroups=kultus%3A51&text=satutuokio',
      description: 'Search page with filters',
    },
  ])(
    'getHrefForNonCmsPage returns $expected for $description',
    ({ pathname, query, language, expected }) => {
      // Inject the mock or use the real stringifyUrlObject via getLocalizedCmsItemUrl
      expect(getHrefForNonCmsPage(pathname, query, language)).toBe(expected);
    }
  );
});
