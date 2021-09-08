import { TextEncoder, TextDecoder } from 'util';

import { screen, fireEvent } from '@testing-library/react';
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

// To avoid error: ReferenceError: TextEncoder is not defined
// discusssed here: https://github.com/jsdom/jsdom/issues/2524
global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextDecoder = TextDecoder as any;

describe('CMS Page', () => {
  it('renders cms page with navigation menu and content', async () => {
    const menu = [
      {
        title: 'Link1',
      },
      {
        title: 'Link2',
      },
      {
        title: 'Link3',
      },
      {
        title: 'Link4',
      },
      {
        title: 'Link5',
      },
    ];
    const page = {
      title: 'Sivun otsikko',
      content: 'Sivun kontentti',
    };
    initMocks({
      menu,
      page,
    });

    const { render } = await getPage({
      route: '/cms-page/helsinki-liikkuu',
    });
    render();

    menu.forEach((menuItem) => {
      expect(
        screen.queryByRole('link', { name: menuItem.title })
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole('heading', {
        name: page.title,
      })
    ).toBeInTheDocument();
    expect(screen.queryByText(page.content)).toBeInTheDocument();
  });
});

const initMocks = ({
  menu,
  page,
}: {
  menu: Partial<Page>[];
  page: Partial<Page>;
}) => {
  server.use(
    graphql.query<MenuQuery, MenuQueryVariables>('Menu', (req, res, ctx) => {
      return res(
        ctx.data({
          menu: {
            __typename: 'Menu',
            menuItems: {
              __typename: 'MenuToMenuItemConnection',
              nodes: menu.map((menuItem) => ({
                __typename: 'MenuItem',
                connectedNode: {
                  __typename: 'MenuItemToMenuItemLinkableConnectionEdge',
                  node: fakePage({
                    title: menuItem.title,
                  }),
                },
              })),
            },
          },
        })
      );
    }),
    graphql.query<PageQuery, PageQueryVariables>('Page', (req, res, ctx) => {
      return res(
        ctx.data({
          page: fakePage(page),
        })
      );
    })
  );
};
