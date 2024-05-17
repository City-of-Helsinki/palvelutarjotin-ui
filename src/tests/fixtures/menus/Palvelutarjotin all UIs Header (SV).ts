import { LanguageCodeEnum } from './types';
import type { MenuQuery } from './types';

const menu: MenuQuery = {
  menu: {
    __typename: 'Menu',
    id: 'dGVybTozMzg=',
    menuItems: {
      __typename: 'MenuToMenuItemConnection',
      nodes: [
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyNzM0',
          connectedNode: {
            __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
            node: {
              __typename: 'Page',
              translations: [
                {
                  __typename: 'Page',
                  id: 'cG9zdDo2OQ==',
                  slug: 'what-is-kultus',
                  uri: '/en/what-is-kultus/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.En,
                    id: 'TGFuZ3VhZ2U6ZW4=',
                    slug: 'en',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/mika-kultus/',
                      slug: 'mika-kultus',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.Fi,
                        id: 'TGFuZ3VhZ2U6Zmk=',
                        slug: 'fi',
                      },
                    },
                    {
                      __typename: 'Page',
                      uri: '/sv/vad-ar-kultus/',
                      slug: 'vad-ar-kultus',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.Sv,
                        id: 'TGFuZ3VhZ2U6c3Y=',
                        slug: 'sv',
                      },
                    },
                  ],
                },
                {
                  __typename: 'Page',
                  id: 'cG9zdDo2MA==',
                  slug: 'mika-kultus',
                  uri: '/mika-kultus/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.Fi,
                    id: 'TGFuZ3VhZ2U6Zmk=',
                    slug: 'fi',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/en/what-is-kultus/',
                      slug: 'what-is-kultus',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.En,
                        id: 'TGFuZ3VhZ2U6ZW4=',
                        slug: 'en',
                      },
                    },
                    {
                      __typename: 'Page',
                      uri: '/sv/vad-ar-kultus/',
                      slug: 'vad-ar-kultus',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.Sv,
                        id: 'TGFuZ3VhZ2U6c3Y=',
                        slug: 'sv',
                      },
                    },
                  ],
                },
              ],
              id: 'cG9zdDo3MQ==',
              slug: 'vad-ar-kultus',
              uri: '/sv/vad-ar-kultus/',
              language: {
                __typename: 'Language',
                code: LanguageCodeEnum.Sv,
                id: 'TGFuZ3VhZ2U6c3Y=',
                slug: 'sv',
              },
            },
          },
        },
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyNzM1',
          connectedNode: {
            __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
            node: {
              __typename: 'Page',
              translations: [
                {
                  __typename: 'Page',
                  id: 'cG9zdDo3Nw==',
                  slug: 'cultural-education',
                  uri: '/en/cultural-education/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.En,
                    id: 'TGFuZ3VhZ2U6ZW4=',
                    slug: 'en',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/kulttuurikasvatus/',
                      slug: 'kulttuurikasvatus',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.Fi,
                        id: 'TGFuZ3VhZ2U6Zmk=',
                        slug: 'fi',
                      },
                    },
                    {
                      __typename: 'Page',
                      uri: '/sv/kulturpedagogik/',
                      slug: 'kulturpedagogik',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.Sv,
                        id: 'TGFuZ3VhZ2U6c3Y=',
                        slug: 'sv',
                      },
                    },
                  ],
                },
                {
                  __typename: 'Page',
                  id: 'cG9zdDo2Mg==',
                  slug: 'kulttuurikasvatus',
                  uri: '/kulttuurikasvatus/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.Fi,
                    id: 'TGFuZ3VhZ2U6Zmk=',
                    slug: 'fi',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/en/cultural-education/',
                      slug: 'cultural-education',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.En,
                        id: 'TGFuZ3VhZ2U6ZW4=',
                        slug: 'en',
                      },
                    },
                    {
                      __typename: 'Page',
                      uri: '/sv/kulturpedagogik/',
                      slug: 'kulturpedagogik',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.Sv,
                        id: 'TGFuZ3VhZ2U6c3Y=',
                        slug: 'sv',
                      },
                    },
                  ],
                },
              ],
              id: 'cG9zdDoxNzMw',
              slug: 'kulturpedagogik',
              uri: '/sv/kulturpedagogik/',
              language: {
                __typename: 'Language',
                code: LanguageCodeEnum.Sv,
                id: 'TGFuZ3VhZ2U6c3Y=',
                slug: 'sv',
              },
            },
          },
        },
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyNzU5',
          connectedNode: {
            __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
            node: {
              __typename: 'Page',
              translations: [
                {
                  __typename: 'Page',
                  id: 'cG9zdDo2NDE=',
                  slug: 'kulttuurikasvatuksen-kasitteita',
                  uri: '/kulttuurikasvatus/kulttuurikasvatuksen-kasitteita/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.Fi,
                    id: 'TGFuZ3VhZ2U6Zmk=',
                    slug: 'fi',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/sv/kulturpedagogik/centrala-begrepp-2/',
                      slug: 'centrala-begrepp-2',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.Sv,
                        id: 'TGFuZ3VhZ2U6c3Y=',
                        slug: 'sv',
                      },
                    },
                    {
                      __typename: 'Page',
                      uri: '/en/cultural-education/key-concepts/',
                      slug: 'key-concepts',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.En,
                        id: 'TGFuZ3VhZ2U6ZW4=',
                        slug: 'en',
                      },
                    },
                  ],
                },
                {
                  __typename: 'Page',
                  id: 'cG9zdDoyNDI3',
                  slug: 'key-concepts',
                  uri: '/en/cultural-education/key-concepts/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.En,
                    id: 'TGFuZ3VhZ2U6ZW4=',
                    slug: 'en',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/sv/kulturpedagogik/centrala-begrepp-2/',
                      slug: 'centrala-begrepp-2',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.Sv,
                        id: 'TGFuZ3VhZ2U6c3Y=',
                        slug: 'sv',
                      },
                    },
                    {
                      __typename: 'Page',
                      uri: '/kulttuurikasvatus/kulttuurikasvatuksen-kasitteita/',
                      slug: 'kulttuurikasvatuksen-kasitteita',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.Fi,
                        id: 'TGFuZ3VhZ2U6Zmk=',
                        slug: 'fi',
                      },
                    },
                  ],
                },
              ],
              id: 'cG9zdDoyNDE5',
              slug: 'centrala-begrepp-2',
              uri: '/sv/kulturpedagogik/centrala-begrepp-2/',
              language: {
                __typename: 'Language',
                code: LanguageCodeEnum.Sv,
                id: 'TGFuZ3VhZ2U6c3Y=',
                slug: 'sv',
              },
            },
          },
        },
      ],
    },
  },
};

export default menu;
