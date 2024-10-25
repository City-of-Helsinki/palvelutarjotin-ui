import React from 'react';
import {
  LanguageCodeEnum,
  LanguagesDocument,
  MenuDocument,
} from 'react-helsinki-headless-cms/apollo';

import { render, screen, waitFor } from '../../../../utils/testUtils';
import Footer from '../Footer';

const footerMenu = [
  { title: 'Saavutettavuusseloste', uri: '/saavutettavuusseloste' },
  { title: 'Käyttöehdot', uri: '/kayttoehdot' },
  { title: 'Anna palautetta', uri: '/palaute' },
  { title: 'Palveluntarjoajille', uri: 'https://kultus-admin.hel.fi' },
];

// Mock menu query for header
const menuMock = {
  request: {
    query: MenuDocument,
    variables: {
      id: 'Palvelutarjotin-UI Footer (FI)',
      menuIdentifiersOnly: true,
    },
  },
  result: {
    data: {
      menu: {
        id: 1,
        __typename: 'Menu',
        menuItems: {
          __typename: 'MenuToMenuItemConnection',
          nodes: footerMenu.map((menuItem, index) => ({
            __typename: 'MenuItem',
            connectedNode: null,
            id: index,
            path: menuItem.uri,
            title: menuItem.title,
            label: menuItem.title,
            order: index,
            target: '',
            parentId: null,
          })),
        },
      },
    },
  },
};

// Mock menu query for header
const languagesMock = {
  request: {
    query: LanguagesDocument,
  },
  result: {
    data: {
      languages: [
        {
          code: LanguageCodeEnum.Fi,
          id: 'TGFuZ3VhZ2U6Zmk=',
          locale: 'fi',
          name: 'Suomi',
          slug: 'fi',
          __typename: 'Language',
        },
        {
          code: LanguageCodeEnum.En,
          id: 'TGFuZ3VhZ2U6ZW4=',
          locale: 'en_US',
          name: 'English',
          slug: 'en',
          __typename: 'Language',
        },
        {
          code: LanguageCodeEnum.Sv,
          id: 'TGFuZ3VhZ2U6c3Y=',
          locale: 'sv_SE',
          name: 'Svenska',
          slug: 'sv',
          __typename: 'Language',
        },
      ],
    },
  },
};

const mocks = [{ ...menuMock }, { ...languagesMock }];

// it.todo('Footer matches snapshot');
// FIXME: Some reason why the Footer uses the actual real connection to the Headless CMS.
// This test should use the mockedProvider instead.
it('Footer matches snapshot', async () => {
  const { container } = render(<Footer />, { mocks });

  await waitFor(() => {
    expect(screen.getByText(footerMenu[0].title)).toBeInTheDocument();
  });
  expect(screen.getByText(footerMenu[1].title)).toBeInTheDocument();
  expect(container.firstChild).toMatchSnapshot();
});
