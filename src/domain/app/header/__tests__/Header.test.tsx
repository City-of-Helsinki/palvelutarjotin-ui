import { MockedResponse } from '@apollo/client/testing';
import React from 'react';
// import { MenuDocument } from 'react-helsinki-headless-cms/apollo';
import { MenuDocument } from 'react-helsinki-headless-cms/apollo';

// import { fakePage } from '../../../../utils/cmsMockDataUtils';
import { DEFAULT_HEADER_MENU_NAME } from '../../../../constants';
import { NotificationDocument } from '../../../../generated/graphql-cms';
import { menuIdToMockMenuData } from '../../../../tests/apollo-mocks/menuMocks';
import { fakeNotification } from '../../../../utils/cmsMockDataUtils';
import { render } from '../../../../utils/testUtils';
import Header from '../Header';

/*const route1 = '/helsinki-liikkuu/';
const route2 = '/helsinki-liikkuu/alisivu/';
const title1 = 'Mikä Kultus?';
const subTitle1 = 'Mikä Kultus alisivu1';
const subTitle2 = 'Mikä Kultus alisivu2';
const mainMenu = [
  {
    title: title1,
    uri: route1,
    children: [
      {
        title: subTitle1,
        uri: route2,
      },
      {
        title: subTitle2,
        uri: route2,
      },
    ],
  },
  { title: 'Helsinki liikkuu', uri: '/' },
  { title: 'Kulttuurikasvatus', uri: '/' },
  { title: 'Oppimateriaalit', uri: '/' },
  { title: 'Kultus sivu', uri: '/' },
];

// Mock menu query for header

const mocks = [
  {
    request: {
      query: MenuDocument,
      variables: {
        id: 'Palvelutarjotin all UIs Header (FI)',
        menuIdentifiersOnly: true,
      },
    },
    result: {
      data: {
        menu: {
          __typename: 'Menu',
          menuItems: {
            __typename: 'MenuToMenuItemConnection',
            nodes: [
              ...mainMenu.map((menuItem) => ({
                __typename: 'MenuItem',
                id: 'cG9zdDo0MDk=',
                parentId: null,
                order: 1,
                target: null,
                title: null,
                path: menuItem.uri,
                label: menuItem.title,
                connectedNode: {
                  __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
                  node: fakePage({
                    title: menuItem.title,
                    uri: menuItem.uri,
                    children: {
                      __typename:
                        'HierarchicalContentNodeToContentNodeChildrenConnection',
                      edges: [],
                      // child node are rendered under dropdown
                      nodes:
                        menuItem?.children?.map((childItem) =>
                          fakePage({
                            title: childItem.title,
                            uri: childItem.uri,
                          })
                        ) ?? [],
                    },
                  }),
                },
              })),
            ],
          },
        },
      },
    },
  },
]; */

const headerMenuMock: MockedResponse = {
  request: {
    query: MenuDocument,
    variables: {
      id: DEFAULT_HEADER_MENU_NAME['fi'],
      menuIdentifiersOnly: true,
    },
  },
  result: {
    data: {
      menu: menuIdToMockMenuData[DEFAULT_HEADER_MENU_NAME['fi']],
    },
  },
};

const notificationMock: MockedResponse = {
  request: {
    query: NotificationDocument,
    variables: {
      language: 'fi',
    },
  },
  result: {
    data: {
      notification: fakeNotification({
        title: 'Notification title',
        content: '<p>Notification content</p>',
      }),
    },
  },
};

const mocks: MockedResponse[] = [headerMenuMock, notificationMock];

it('Header matches snapshot', () => {
  const { container } = render(<Header />, { mocks });

  expect(container.firstChild).toMatchSnapshot();
});

/* describe('cimode in language selector', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test('cimode is rendered in a list of languages when feature flag is on', async () => {
    process.env.NEXT_PUBLIC_LANGUAGE_CIMODE_VISIBLE = 'true';
    render(<Header />);
    await screen.findAllByText(/CIMODE/);
  });

  test('cimode is not rendered in a list of languages when feature flag is off', async () => {
    process.env.NEXT_PUBLIC_LANGUAGE_CIMODE_VISIBLE = 'false';
    render(<Header />);
    expect(screen.queryAllByText(/CIMODE/).length).toBe(0);
  }); 
});

describe('navigation', () => {
  it('renders menus and dropdown menus', async () => {
    const { container } = render(<Header />, { mocks });

    // dropdown menu with dropdown items
    await screen.findByRole('button', { name: title1 });
    screen.getByText(subTitle1);
    screen.getByText(subTitle2);

    expect(container).toMatchSnapshot();
  });
});*/
