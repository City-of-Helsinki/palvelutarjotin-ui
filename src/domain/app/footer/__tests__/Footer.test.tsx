import React from 'react';
import { MenuDocument } from 'react-helsinki-headless-cms/apollo';

import { fakePage } from '../../../../utils/cmsMockDataUtils';
import { render, screen, waitFor } from '../../../../utils/testUtils';
import Footer from '../Footer';

const footerMenu = [
  { title: 'Saavutettavuusseloste', uri: '/saavutettavuusseloste' },
  { title: 'Käyttöehdot', uri: '/kayttoehdot' },
  { title: 'Anna palautetta', uri: '/palaute' },
  { title: 'Palveluntarjoajille', uri: 'https://provider.kultus.fi' },
];

// Mock menu query for header
const mocks = [
  {
    request: {
      query: MenuDocument,
      variables: {
        id: 'Palvelutarjotin-UI Footer (FI)',
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
            })),
          },
        },
      },
    },
  },
];

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
