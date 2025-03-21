import React from 'react';

import * as GraphQLCms from '../../../../generated/graphql-cms';
import { emptyMenuQueryMocks } from '../../../../tests/apollo-mocks/menuMocks';
import { fakeNotification } from '../../../../utils/cmsMockDataUtils';
import {
  render,
  screen,
  within,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import PageLayout from '../PageLayout';

jest.mock('../../../../generated/graphql-cms', () => ({
  esModule: true,
  ...jest.requireActual<Record<string, unknown>>(
    '../../../../generated/graphql-cms'
  ),
  useNotificationQuery: jest.fn(),
}));

const notificationContent = 'Notification content';
const notificationTitle = 'Notification title';

it('PageLayout matches snapshot', () => {
  const notificationMock = {
    notification: fakeNotification({
      title: '',
      content: '',
    }),
  };
  jest.spyOn(GraphQLCms, 'useNotificationQuery').mockReturnValue({
    data: { ...notificationMock },
    loading: false,
  } as any);
  const { container } = render(
    <PageLayout>
      <div>Page layout children</div>
    </PageLayout>,
    { mocks: [...emptyMenuQueryMocks] }
  );
  expect(container.firstChild).toMatchSnapshot();
});

it('renders notification and it can be closed', async () => {
  const notificationMock = {
    notification: fakeNotification({
      title: notificationTitle,
      content: `<p>${notificationContent}</p>`,
    }),
  };
  jest.spyOn(GraphQLCms, 'useNotificationQuery').mockReturnValue({
    data: { ...notificationMock },
    loading: false,
  } as any);
  render(
    <PageLayout>
      <div>Page layout children</div>
    </PageLayout>,
    { mocks: [...emptyMenuQueryMocks] }
  );

  const notification = await screen.findByRole('region', {
    name: /notification/i,
  });

  await within(notification).findByText(notificationContent);
  await within(notification).findByText(notificationTitle);

  await userEvent.click(
    await within(notification).findByRole('button', {
      name: 'Sulje huomiotiedote',
    })
  );
  await waitFor(() => {
    expect(
      screen.queryByRole('region', {
        name: /notification/i,
      })
    ).not.toBeInTheDocument();
  });
});

it("doesn't render notification when there are none", async () => {
  const notificationMock = {
    notification: fakeNotification({
      title: '',
      content: '',
    }),
  };
  jest.spyOn(GraphQLCms, 'useNotificationQuery').mockReturnValue({
    data: { ...notificationMock },
    loading: false,
  } as any);
  render(
    <PageLayout>
      <div>Page layout children</div>
    </PageLayout>,
    { mocks: [...emptyMenuQueryMocks] }
  );

  await waitFor(() => {
    expect(
      screen.queryByRole('region', { name: /notification/i })
    ).not.toBeInTheDocument();
  });
});
