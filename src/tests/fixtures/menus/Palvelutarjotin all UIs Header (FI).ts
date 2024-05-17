import { LanguageCodeEnum } from './types';
import type { MenuQuery } from './types';

const menu: MenuQuery = {
  menu: {
    __typename: 'Menu',
    id: 'dGVybTozMzc=',
    menuItems: {
      __typename: 'MenuToMenuItemConnection',
      nodes: [
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyNzE5',
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
                  id: 'cG9zdDo3MQ==',
                  slug: 'vad-ar-kultus',
                  uri: '/sv/vad-ar-kultus/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.Sv,
                    id: 'TGFuZ3VhZ2U6c3Y=',
                    slug: 'sv',
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
                      uri: '/mika-kultus/',
                      slug: 'mika-kultus',
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
              id: 'cG9zdDo2MA==',
              slug: 'mika-kultus',
              uri: '/mika-kultus/',
              language: {
                __typename: 'Language',
                code: LanguageCodeEnum.Fi,
                id: 'TGFuZ3VhZ2U6Zmk=',
                slug: 'fi',
              },
            },
          },
        },
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyNzIx',
          connectedNode: {
            __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
            node: {
              __typename: 'Page',
              translations: [],
              id: 'cG9zdDo2MzY=',
              slug: 'yhteystiedot',
              uri: '/mika-kultus/yhteystiedot/',
              language: {
                __typename: 'Language',
                code: LanguageCodeEnum.Fi,
                id: 'TGFuZ3VhZ2U6Zmk=',
                slug: 'fi',
              },
            },
          },
        },
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyNzIy',
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
                  id: 'cG9zdDoxNzMw',
                  slug: 'kulturpedagogik',
                  uri: '/sv/kulturpedagogik/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.Sv,
                    id: 'TGFuZ3VhZ2U6c3Y=',
                    slug: 'sv',
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
                      uri: '/kulttuurikasvatus/',
                      slug: 'kulttuurikasvatus',
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
              id: 'cG9zdDo2Mg==',
              slug: 'kulttuurikasvatus',
              uri: '/kulttuurikasvatus/',
              language: {
                __typename: 'Language',
                code: LanguageCodeEnum.Fi,
                id: 'TGFuZ3VhZ2U6Zmk=',
                slug: 'fi',
              },
            },
          },
        },
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyNzI0',
          connectedNode: {
            __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
            node: {
              __typename: 'Page',
              translations: [
                {
                  __typename: 'Page',
                  id: 'cG9zdDoyNDE5',
                  slug: 'centrala-begrepp-2',
                  uri: '/sv/kulturpedagogik/centrala-begrepp-2/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.Sv,
                    id: 'TGFuZ3VhZ2U6c3Y=',
                    slug: 'sv',
                  },
                  translations: [
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
              id: 'cG9zdDo2NDE=',
              slug: 'kulttuurikasvatuksen-kasitteita',
              uri: '/kulttuurikasvatus/kulttuurikasvatuksen-kasitteita/',
              language: {
                __typename: 'Language',
                code: LanguageCodeEnum.Fi,
                id: 'TGFuZ3VhZ2U6Zmk=',
                slug: 'fi',
              },
            },
          },
        },
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyNzI1',
          connectedNode: {
            __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
            node: {
              __typename: 'Page',
              translations: [],
              id: 'cG9zdDoyNjE=',
              slug: 'yhteistyo',
              uri: '/kulttuurikasvatus/yhteistyo/',
              language: {
                __typename: 'Language',
                code: LanguageCodeEnum.Fi,
                id: 'TGFuZ3VhZ2U6Zmk=',
                slug: 'fi',
              },
            },
          },
        },
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyNzI2',
          connectedNode: {
            __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
            node: {
              __typename: 'Page',
              translations: [
                {
                  __typename: 'Page',
                  id: 'cG9zdDoyNDMx',
                  slug: 'cultural-routes',
                  uri: '/en/cultural-education/cultural-routes/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.En,
                    id: 'TGFuZ3VhZ2U6ZW4=',
                    slug: 'en',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/kulttuurikasvatus/kulttuuripolulla-kulttuuria-kaikille/',
                      slug: 'kulttuuripolulla-kulttuuria-kaikille',
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
              id: 'cG9zdDoyNDg=',
              slug: 'kulttuuripolulla-kulttuuria-kaikille',
              uri: '/kulttuurikasvatus/kulttuuripolulla-kulttuuria-kaikille/',
              language: {
                __typename: 'Language',
                code: LanguageCodeEnum.Fi,
                id: 'TGFuZ3VhZ2U6Zmk=',
                slug: 'fi',
              },
            },
          },
        },
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyNzI3',
          connectedNode: {
            __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
            node: {
              __typename: 'Page',
              translations: [],
              id: 'cG9zdDo2Nw==',
              slug: 'oppimateriaalit',
              uri: '/oppimateriaalit/',
              language: {
                __typename: 'Language',
                code: LanguageCodeEnum.Fi,
                id: 'TGFuZ3VhZ2U6Zmk=',
                slug: 'fi',
              },
            },
          },
        },
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyNzI5',
          connectedNode: {
            __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
            node: {
              __typename: 'Page',
              translations: [
                {
                  __typename: 'Page',
                  id: 'cG9zdDoxNTQ=',
                  slug: 'high-school',
                  uri: '/en/learning-materials/high-school/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.En,
                    id: 'TGFuZ3VhZ2U6ZW4=',
                    slug: 'en',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/oppimateriaalit/ylakoulu-ja-toinen-aste/',
                      slug: 'ylakoulu-ja-toinen-aste',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.Fi,
                        id: 'TGFuZ3VhZ2U6Zmk=',
                        slug: 'fi',
                      },
                    },
                    {
                      __typename: 'Page',
                      uri: '/sv/laromedel/gymnasium/',
                      slug: 'gymnasium',
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
                  id: 'cG9zdDoxNTY=',
                  slug: 'gymnasium',
                  uri: '/sv/laromedel/gymnasium/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.Sv,
                    id: 'TGFuZ3VhZ2U6c3Y=',
                    slug: 'sv',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/en/learning-materials/high-school/',
                      slug: 'high-school',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.En,
                        id: 'TGFuZ3VhZ2U6ZW4=',
                        slug: 'en',
                      },
                    },
                    {
                      __typename: 'Page',
                      uri: '/oppimateriaalit/ylakoulu-ja-toinen-aste/',
                      slug: 'ylakoulu-ja-toinen-aste',
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
              id: 'cG9zdDoxNDM=',
              slug: 'ylakoulu-ja-toinen-aste',
              uri: '/oppimateriaalit/ylakoulu-ja-toinen-aste/',
              language: {
                __typename: 'Language',
                code: LanguageCodeEnum.Fi,
                id: 'TGFuZ3VhZ2U6Zmk=',
                slug: 'fi',
              },
            },
          },
        },
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyNzMw',
          connectedNode: {
            __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
            node: {
              __typename: 'Page',
              translations: [
                {
                  __typename: 'Page',
                  id: 'cG9zdDoxNDY=',
                  slug: 'elementary-school',
                  uri: '/en/learning-materials/elementary-school/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.En,
                    id: 'TGFuZ3VhZ2U6ZW4=',
                    slug: 'en',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/oppimateriaalit/alakoulu/',
                      slug: 'alakoulu',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.Fi,
                        id: 'TGFuZ3VhZ2U6Zmk=',
                        slug: 'fi',
                      },
                    },
                    {
                      __typename: 'Page',
                      uri: '/sv/laromedel/grundskola/',
                      slug: 'grundskola',
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
                  id: 'cG9zdDoxNDg=',
                  slug: 'grundskola',
                  uri: '/sv/laromedel/grundskola/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.Sv,
                    id: 'TGFuZ3VhZ2U6c3Y=',
                    slug: 'sv',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/en/learning-materials/elementary-school/',
                      slug: 'elementary-school',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.En,
                        id: 'TGFuZ3VhZ2U6ZW4=',
                        slug: 'en',
                      },
                    },
                    {
                      __typename: 'Page',
                      uri: '/oppimateriaalit/alakoulu/',
                      slug: 'alakoulu',
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
              id: 'cG9zdDoxNDA=',
              slug: 'alakoulu',
              uri: '/oppimateriaalit/alakoulu/',
              language: {
                __typename: 'Language',
                code: LanguageCodeEnum.Fi,
                id: 'TGFuZ3VhZ2U6Zmk=',
                slug: 'fi',
              },
            },
          },
        },
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyNzMx',
          connectedNode: {
            __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
            node: {
              __typename: 'Page',
              translations: [
                {
                  __typename: 'Page',
                  id: 'cG9zdDoxNTA=',
                  slug: 'early-childhood-education',
                  uri: '/en/learning-materials/early-childhood-education/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.En,
                    id: 'TGFuZ3VhZ2U6ZW4=',
                    slug: 'en',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/oppimateriaalit/varhaiskasvatus/',
                      slug: 'varhaiskasvatus',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.Fi,
                        id: 'TGFuZ3VhZ2U6Zmk=',
                        slug: 'fi',
                      },
                    },
                    {
                      __typename: 'Page',
                      uri: '/sv/laromedel/tidig-barndom/',
                      slug: 'tidig-barndom',
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
                  id: 'cG9zdDoxNTI=',
                  slug: 'tidig-barndom',
                  uri: '/sv/laromedel/tidig-barndom/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.Sv,
                    id: 'TGFuZ3VhZ2U6c3Y=',
                    slug: 'sv',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/en/learning-materials/early-childhood-education/',
                      slug: 'early-childhood-education',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.En,
                        id: 'TGFuZ3VhZ2U6ZW4=',
                        slug: 'en',
                      },
                    },
                    {
                      __typename: 'Page',
                      uri: '/oppimateriaalit/varhaiskasvatus/',
                      slug: 'varhaiskasvatus',
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
              id: 'cG9zdDoxMzc=',
              slug: 'varhaiskasvatus',
              uri: '/oppimateriaalit/varhaiskasvatus/',
              language: {
                __typename: 'Language',
                code: LanguageCodeEnum.Fi,
                id: 'TGFuZ3VhZ2U6Zmk=',
                slug: 'fi',
              },
            },
          },
        },
      ],
    },
  },
};

export default menu;
