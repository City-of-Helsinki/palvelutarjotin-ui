import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { NotificationDocument } from '../../../../generated/graphql-cms';
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

const notificationContent = 'Notification content';
const notificationTitle = 'Notification title';

const createMocks = (
  notificationTitle: string,
  notificationContent: string
): MockedResponse[] => [
  ...emptyMenuQueryMocks,
  {
    request: {
      query: NotificationDocument,
      variables: {
        language: 'fi',
      },
    },
    result: {
      data: {
        notification: fakeNotification({
          title: notificationTitle,
          content: notificationContent,
        }),
      },
    },
  },
];

const mocksWithNonEmptyNotification = createMocks(
  notificationTitle,
  `<p>${notificationContent}</p>`
);
const mocksWithEmptyNotification = createMocks('', '');

it('PageLayout matches snapshot', () => {
  const { container } = render(
    <PageLayout>
      <div>Page layout children</div>
    </PageLayout>,
    { mocks: mocksWithNonEmptyNotification }
  );
  expect(container.firstChild).toMatchSnapshot();
});

it('renders notification and it can be closed', async () => {
  render(
    <PageLayout>
      <div>Page layout children</div>
    </PageLayout>,
    { mocks: mocksWithNonEmptyNotification }
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
  render(
    <PageLayout>
      <div>Page layout children</div>
    </PageLayout>,
    { mocks: mocksWithEmptyNotification }
  );

  await waitFor(() => {
    expect(
      screen.queryByRole('region', { name: /notification/i })
    ).not.toBeInTheDocument();
  });
});
