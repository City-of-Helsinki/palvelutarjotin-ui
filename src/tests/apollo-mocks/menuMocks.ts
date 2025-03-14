import { MockedResponse } from '@apollo/client/testing';
import { MenuDocument } from 'react-helsinki-headless-cms/apollo';

import {
  DEFAULT_FOOTER_MENU_NAME,
  DEFAULT_HEADER_MENU_NAME,
} from '../../constants';
import { PageInfo } from '../../domain/headless-cms/utils';
import enHeaderMenu from '../fixtures/menus/Palvelutarjotin all UIs Header (EN)';
import fiHeaderMenu from '../fixtures/menus/Palvelutarjotin all UIs Header (FI)';
import svHeaderMenu from '../fixtures/menus/Palvelutarjotin all UIs Header (SV)';
import enFooterMenu from '../fixtures/menus/Palvelutarjotin-UI Footer (EN)';
import fiFooterMenu from '../fixtures/menus/Palvelutarjotin-UI Footer (FI)';
import svFooterMenu from '../fixtures/menus/Palvelutarjotin-UI Footer (SV)';

export const menuIdToMockMenuData = {
  [DEFAULT_HEADER_MENU_NAME['en']]: enHeaderMenu,
  [DEFAULT_HEADER_MENU_NAME['fi']]: fiHeaderMenu,
  [DEFAULT_HEADER_MENU_NAME['sv']]: svHeaderMenu,
  [DEFAULT_FOOTER_MENU_NAME['en']]: enFooterMenu,
  [DEFAULT_FOOTER_MENU_NAME['fi']]: fiFooterMenu,
  [DEFAULT_FOOTER_MENU_NAME['sv']]: svFooterMenu,
} as const;

/** Menu query mocks for English, Finnish and Swedish. */
export const menuQueryMocks = Object.entries(menuIdToMockMenuData).map(
  ([id, menu]) => ({
    variables: { id, menuIdentifiersOnly: false },
    response: menu,
  })
);

const generateEmptyMenuQueryMocks = (
  menuIdentifiersOnly: boolean
): MockedResponse[] => {
  return Object.keys(menuIdToMockMenuData).map((id) => ({
    request: {
      query: MenuDocument,
      variables: { id, menuIdentifiersOnly },
    },
    result: {
      data: {
        menu: null,
      },
    },
  }));
};

/** Empty menu query mocks for English, Finnish and Swedish. */
export const emptyMenuQueryMocks: MockedResponse[] = [
  ...generateEmptyMenuQueryMocks(true),
  ...generateEmptyMenuQueryMocks(false),
];

/** All menu pages when querying the mocked menu queries. */
export const allMockedMenuPages: PageInfo[] = [
  {
    uri: '/en/accessibility-statement/',
    slug: 'accessibility-statement',
    locale: 'en',
  },
  { uri: '/oppimateriaalit/alakoulu/', slug: 'alakoulu', locale: 'fi' },
  {
    uri: '/sv/anvandarvillkor/',
    slug: 'anvandarvillkor',
    locale: 'sv',
  },
  {
    uri: '/sv/kulturpedagogik/centrala-begrepp-2/',
    slug: 'centrala-begrepp-2',
    locale: 'sv',
  },
  {
    uri: '/en/cultural-education/',
    slug: 'cultural-education',
    locale: 'en',
  },
  {
    uri: '/en/cultural-education/cultural-routes/',
    slug: 'cultural-routes',
    locale: 'en',
  },
  {
    uri: '/kayttoehdot/',
    slug: 'kayttoehdot',
    locale: 'fi',
  },
  {
    uri: '/en/cultural-education/key-concepts/',
    slug: 'key-concepts',
    locale: 'en',
  },
  {
    uri: '/kulttuurikasvatus/kulttuurikasvatuksen-kasitteita/',
    slug: 'kulttuurikasvatuksen-kasitteita',
    locale: 'fi',
  },
  {
    uri: '/kulttuurikasvatus/',
    slug: 'kulttuurikasvatus',
    locale: 'fi',
  },
  {
    uri: '/kulttuurikasvatus/kulttuuripolulla-kulttuuria-kaikille/',
    slug: 'kulttuuripolulla-kulttuuria-kaikille',
    locale: 'fi',
  },
  { uri: '/sv/kulturpedagogik/', slug: 'kulturpedagogik', locale: 'sv' },
  {
    uri: '/mika-kultus/',
    slug: 'mika-kultus',
    locale: 'fi',
  },
  { uri: '/oppimateriaalit/', slug: 'oppimateriaalit', locale: 'fi' },
  {
    uri: '/saavutettavuusseloste/',
    slug: 'saavutettavuusseloste',
    locale: 'fi',
  },
  {
    uri: '/en/terms-of-service/',
    slug: 'terms-of-service',
    locale: 'en',
  },
  {
    uri: '/sv/tillganglighetsutlatande/',
    slug: 'tillganglighetsutlatande',
    locale: 'sv',
  },
  {
    uri: '/sv/vad-ar-kultus/',
    slug: 'vad-ar-kultus',
    locale: 'sv',
  },
  {
    uri: '/oppimateriaalit/varhaiskasvatus/',
    slug: 'varhaiskasvatus',
    locale: 'fi',
  },
  {
    uri: '/en/what-is-kultus/',
    slug: 'what-is-kultus',
    locale: 'en',
  },
  {
    uri: '/kulttuurikasvatus/yhteistyo/',
    slug: 'yhteistyo',
    locale: 'fi',
  },
  {
    uri: '/mika-kultus/yhteystiedot/',
    slug: 'yhteystiedot',
    locale: 'fi',
  },
  {
    uri: '/oppimateriaalit/ylakoulu-ja-toinen-aste/',
    slug: 'ylakoulu-ja-toinen-aste',
    locale: 'fi',
  },
];
