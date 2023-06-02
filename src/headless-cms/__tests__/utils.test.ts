import { dequal } from 'dequal';
import { graphql } from 'msw';

import {
  LanguageCodeEnum,
  MenuNodeIdTypeEnum,
  MenuQuery,
  MenuQueryVariables,
  PageIdType,
  PageQuery,
  PageQueryVariables,
} from '../../generated/graphql-cms';
import { server } from '../../tests/msw/server';
import { Language } from '../../types';
import { fakePage, fakeLanguage } from '../../utils/cmsMockDataUtils';
import { MENU_NAME } from '../constants';
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
  it('recursively fetches all children pages', async () => {
    const nestedChildPageUris = ['/child1/', '/child2/', '/child3/'];
    const mocks = {
      Menu: [
        {
          variables: {
            id: MENU_NAME.Header,
            idType: MenuNodeIdTypeEnum.Name,
          },
          response: {
            menu: {
              menuItems: {
                nodes: [
                  {
                    __typename: 'MenuItem',
                    connectedNode: {
                      __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
                      node: fakePage({
                        language: fakeLanguage({ code: LanguageCodeEnum.Fi }),
                        children: {
                          edges: [],
                          nodes: [fakePage({ id: 'child1' })],
                        },
                        __typename: 'Page',
                      }),
                    },
                  },
                ],
                __typename: 'MenuToMenuItemConnection',
              },
              __typename: 'Menu',
            },
          } as MenuQuery,
        },
      ],
      Page: [
        {
          variables: { id: 'child1', idType: PageIdType.Id },
          response: {
            page: fakePage({
              uri: nestedChildPageUris[0],
              children: {
                edges: [],
                nodes: [
                  fakePage({
                    id: 'child2',
                  }),
                ],
              },
            }),
          },
        },
        {
          variables: { id: 'child2', idType: PageIdType.Id },
          response: {
            page: fakePage({
              uri: nestedChildPageUris[1],
              children: {
                edges: [],
                nodes: [
                  fakePage({
                    id: 'child3',
                  }),
                ],
              },
            }),
          },
        },
        {
          variables: { id: 'child3', idType: PageIdType.Id },
          response: {
            page: fakePage({
              uri: nestedChildPageUris[2],
              children: {
                edges: [],
                nodes: [fakePage()],
              },
            }),
          },
        },
      ],
    };
    server.use(
      graphql.query<MenuQuery, MenuQueryVariables>('Menu', (req, res, ctx) => {
        const data = mocks.Menu.find(({ variables }) => {
          return dequal(variables, req.variables);
        });
        return data ? res(ctx.data(data.response)) : res(ctx.data({}));
      }),
      graphql.query<PageQuery, PageQueryVariables>('Page', (req, res, ctx) => {
        const { response } =
          mocks.Page.find(({ variables }) => {
            return dequal(variables, req.variables);
          }) ?? {};
        return response
          ? res(ctx.data(response))
          : res(ctx.data({ page: fakePage() }));
      })
    );

    const pages = await getAllMenuPages();
    expect(pages).toHaveLength(15);

    // Pages should include all the child pages
    expect(pages).toEqual(
      expect.arrayContaining(
        nestedChildPageUris.map((uri) => expect.objectContaining({ uri }))
      )
    );
  });
});
