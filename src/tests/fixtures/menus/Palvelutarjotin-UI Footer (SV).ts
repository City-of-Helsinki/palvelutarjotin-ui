import { LanguageCodeEnum } from './types';
import type { MenuQuery } from './types';

const menu: MenuQuery = {
  menu: {
    __typename: 'Menu',
    id: 'dGVybToyNzM=',
    menuItems: {
      __typename: 'MenuToMenuItemConnection',
      nodes: [
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyMDY5',
          connectedNode: null,
        },
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyMDcw',
          connectedNode: null,
        },
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyMDcx',
          connectedNode: null,
        },
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyMDcy',
          connectedNode: {
            __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
            node: {
              __typename: 'Page',
              translations: [
                {
                  __typename: 'Page',
                  id: 'cG9zdDoyMDMz',
                  slug: 'accessibility-statement',
                  uri: '/en/accessibility-statement/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.En,
                    id: 'TGFuZ3VhZ2U6ZW4=',
                    slug: 'en',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/saavutettavuusseloste/',
                      slug: 'saavutettavuusseloste',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.Fi,
                        id: 'TGFuZ3VhZ2U6Zmk=',
                        slug: 'fi',
                      },
                    },
                    {
                      __typename: 'Page',
                      uri: '/sv/tillganglighetsutlatande/',
                      slug: 'tillganglighetsutlatande',
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
                  id: 'cG9zdDoyMDMx',
                  slug: 'saavutettavuusseloste',
                  uri: '/saavutettavuusseloste/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.Fi,
                    id: 'TGFuZ3VhZ2U6Zmk=',
                    slug: 'fi',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/en/accessibility-statement/',
                      slug: 'accessibility-statement',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.En,
                        id: 'TGFuZ3VhZ2U6ZW4=',
                        slug: 'en',
                      },
                    },
                    {
                      __typename: 'Page',
                      uri: '/sv/tillganglighetsutlatande/',
                      slug: 'tillganglighetsutlatande',
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
              id: 'cG9zdDoyMDM1',
              slug: 'tillganglighetsutlatande',
              uri: '/sv/tillganglighetsutlatande/',
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
          id: 'cG9zdDoyMDcz',
          connectedNode: null,
        },
        {
          __typename: 'MenuItem',
          id: 'cG9zdDoyMTM3',
          connectedNode: {
            __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
            node: {
              __typename: 'Page',
              translations: [
                {
                  __typename: 'Page',
                  id: 'cG9zdDoyMDI3',
                  slug: 'terms-of-service',
                  uri: '/en/terms-of-service/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.En,
                    id: 'TGFuZ3VhZ2U6ZW4=',
                    slug: 'en',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/kayttoehdot/',
                      slug: 'kayttoehdot',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.Fi,
                        id: 'TGFuZ3VhZ2U6Zmk=',
                        slug: 'fi',
                      },
                    },
                    {
                      __typename: 'Page',
                      uri: '/sv/anvandarvillkor/',
                      slug: 'anvandarvillkor',
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
                  id: 'cG9zdDoyMDI1',
                  slug: 'kayttoehdot',
                  uri: '/kayttoehdot/',
                  language: {
                    __typename: 'Language',
                    code: LanguageCodeEnum.Fi,
                    id: 'TGFuZ3VhZ2U6Zmk=',
                    slug: 'fi',
                  },
                  translations: [
                    {
                      __typename: 'Page',
                      uri: '/en/terms-of-service/',
                      slug: 'terms-of-service',
                      language: {
                        __typename: 'Language',
                        code: LanguageCodeEnum.En,
                        id: 'TGFuZ3VhZ2U6ZW4=',
                        slug: 'en',
                      },
                    },
                    {
                      __typename: 'Page',
                      uri: '/sv/anvandarvillkor/',
                      slug: 'anvandarvillkor',
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
              id: 'cG9zdDoyMDI5',
              slug: 'anvandarvillkor',
              uri: '/sv/anvandarvillkor/',
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
