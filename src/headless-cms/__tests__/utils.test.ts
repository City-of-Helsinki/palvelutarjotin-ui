import { dequal } from 'dequal';
import { graphql } from 'msw';
import {
  MenuQuery,
  MenuQueryVariables,
} from 'react-helsinki-headless-cms/apollo';

import {
  allMockedMenuPages,
  menuQueryMocks,
} from '../../tests/apollo-mocks/menuMocks';
import { server } from '../../tests/msw/server';
import { Language } from '../../types';
import {
  getUriID,
  stripLocaleFromUri,
  getAllMenuPages,
  getSlugFromUri,
  removeTrailingSlash,
  slugsToUriSegments,
  uriToBreadcrumbs,
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
