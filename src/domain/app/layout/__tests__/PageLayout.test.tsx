import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { NotificationDocument } from '../../../../generated/graphql-cms';
import { fakeNotification } from '../../../../utils/cmsMockDataUtils';
import {
  render,
  screen,
  act,
  within,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import PageLayout from '../PageLayout';

const notificationContent = 'Notification content';
const notificationTitle = 'Notification title';

const mocks: MockedResponse[] = [
  {
    request: {
      query: NotificationDocument,
    },
    result: {
      data: {
        notification: fakeNotification({
          title: notificationTitle,
          content: `<p>${notificationContent}</p>`,
        }),
      },
    },
  },
];

it('PageLayout matches snapshot', () => {
  const { container } = render(
    <PageLayout>
      <div>Page layout children</div>
    </PageLayout>,
    { mocks }
  );
  expect(container.firstChild).toMatchSnapshot();
});

it('renders notification', async () => {
  render(
    <PageLayout>
      <div>Page layout children</div>
    </PageLayout>,
    { mocks }
  );

  const notification = await screen.findByRole('region', {
    name: /notification/i,
  });

  within(notification).getByText(notificationContent);
  within(notification).getByText(notificationTitle);

  userEvent.click(
    within(notification).getByRole('button', { name: 'Sulje ilmoitus' })
  );

  await waitFor(() => {
    expect(
      screen.queryByRole('region', {
        name: /notification/i,
      })
    ).not.toBeInTheDocument();
  });
});
