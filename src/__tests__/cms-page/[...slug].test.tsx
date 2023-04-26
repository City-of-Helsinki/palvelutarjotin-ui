/* eslint-disable no-console */

import { screen } from '@testing-library/react';
import { getPage } from 'next-page-tester';

import {
  MenuQuery,
  MenuQueryVariables,
  Page,
  PageQuery,
  PageQueryVariables,
} from '../../generated/graphql-cms';
import { graphql, server } from '../../tests/msw/server';
import { fakePage } from '../../utils/cmsMockDataUtils';

// eslint-disable-next-line no-console
const originalError = console.error.bind(console.error);

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.error = (msg: any, ...optionalParams: any[]) => {
    !msg.includes(
      'Warning: Prop `%s` did not match. Server: %s Client: %s%s'
    ) && originalError(msg, ...optionalParams);
  };
});

afterAll(() => {
  // eslint-disable-next-line no-console
  console.error = originalError;
});

const route1 = '/helsinki-liikkuu/';
const route2 = '/helsinki-liikkuu/alisivu/';
const mainMenu = [
  { title: 'Mikä Kultus?', uri: route1 },
  { title: 'Helsinki liikkuu', uri: '/random2/' },
  { title: 'Kulttuurikasvatus', uri: '/random3/' },
  { title: 'Oppimateriaalit', uri: '/random4/' },
  { title: 'Kultus sivu', uri: '/random5/' },
];
const subMenuItems = [
  { title: 'MenuItem1', uri: route2 },
  { title: 'MenuItem2', uri: '/random1/' },
  { title: 'MenuItem3', uri: '/random2/' },
  { title: 'MenuItem4', uri: '/random3/' },
];
const subSubMenuItems = [
  { title: 'SubMenuItem1', uri: '/random/' },
  { title: 'SubMenuItem2', uri: '/random1/' },
  { title: 'SubMenuItem3', uri: '/random2/' },
  { title: 'SubMenuItem4', uri: '/random3/' },
];

const page1 = {
  route: route1,
  title: 'Sivun otsikko',
  content: 'Sivun kontentti',
  menuItems: subMenuItems,
};

const page2 = {
  route: route2,
  title: 'Alisivun otsikko',
  content: 'Alisivun kontentti',
  menuItems: subSubMenuItems,
};

// next-page-tester doesn't support next v12 yet. PR here: https://github.com/toomuchdesign/next-page-tester/issues/281
describe.skip('CMS Page', () => {
  it('renders cms page with navigation and sub menu and content', async () => {
    const page = {
      title: 'Sivun otsikko',
      content: 'Sivun kontentti',
    };
    initMocks({
      page,
    });

    (
      await getPage({
        route: `/cms-page${route1}`,
      })
    ).render();

    mainMenu.forEach(testMenuItem);
    subMenuItems.forEach(testMenuItem);

    expect(
      screen.queryByRole('heading', {
        name: page.title,
      })
    ).toBeInTheDocument();
    expect(screen.queryByText(page.content)).toBeInTheDocument();
  });

  it('renders cms page with navigation menu and 2 sub navigaiton levels and content', async () => {
    const page = {
      title: 'Sivun otsikko',
      content: 'Sivun kontentti',
    };
    initMocks({
      page,
    });

    (
      await getPage({
        route: `/cms-page${route2}`,
      })
    ).render();

    mainMenu.forEach(testMenuItem);
    subMenuItems.forEach(testMenuItem);
    subSubMenuItems.forEach(testMenuItem);

    // sub menu item should have active class
    const activeMenuItem = screen.getByRole('link', {
      name: subMenuItems[0].title,
    });
    expect(activeMenuItem).toHaveClass('activeLink');

    expect(
      screen.queryByRole('heading', {
        name: page.title,
      })
    ).toBeInTheDocument();
    expect(screen.queryByText(page.content)).toBeInTheDocument();
  });
});

const testMenuItem = ({ title, uri }: { title: string; uri: string }) => {
  const link = screen.queryByRole('link', { name: title });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute(
    'href',
    // remove trailing slash from uri
    `/cms-page${uri.replace(/\/$/, '')}`
  );
};

const initMocks = ({ page }: { page: Partial<Page> }) => {
  server.use(
    graphql.query<MenuQuery, MenuQueryVariables>('Menu', (req, res, ctx) => {
      return res(
        ctx.data({
          menu: {
            __typename: 'Menu',
            menuItems: {
              __typename: 'MenuToMenuItemConnection',
              nodes: mainMenu.map((menuItem) => ({
                __typename: 'MenuItem',
                connectedNode: {
                  __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
                  node: fakePage({
                    title: menuItem.title,
                    uri: menuItem.uri,
                  }),
                },
              })),
            },
          },
        })
      );
    }),
    graphql.query<PageQuery, PageQueryVariables>('Page', (req, res, ctx) => {
      if (req.variables.id === page1.route) {
        const nodes = subMenuItems.map((menuItem) =>
          fakePage({
            title: menuItem.title,
            uri: menuItem.uri,
          })
        );
        return res(
          ctx.data({
            page: fakePage({
              title: page.title,
              content: page.content,
              children: {
                nodes,
                edges: nodes.map((node) => ({ node })),
              },
            }),
          })
        );
      }

      if (req.variables.id === page2.route) {
        const nodes = subSubMenuItems.map((menuItem) =>
          fakePage({ title: menuItem.title, uri: menuItem.uri })
        );
        return res(
          ctx.data({
            page: fakePage({
              title: page.title,
              content: page.content,
              children: {
                nodes,
                edges: nodes.map((node) => ({ node })),
              },
            }),
          })
        );
      }

      return res(
        ctx.data({
          page: fakePage(page),
        })
      );
    })
  );
};
