import { dequal } from 'dequal';
import { graphql } from 'msw';
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
} from '../utils';

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
      graphql.query<MenuQuery, MenuQueryVariables>('menu', (req, res, ctx) => {
        const data = menuQueryMocks.find(({ variables }) => {
          return dequal(variables, req.variables);
        });
        return data ? res(ctx.data(data.response)) : res(ctx.data({}));
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
