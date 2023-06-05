import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { NotificationDocument } from '../../../../generated/graphql-cms';
import { fakeNotification } from '../../../../utils/cmsMockDataUtils';
import {
  render,
  screen,
  within,
  userEvent,
  waitFor,
  sleep,
} from '../../../../utils/testUtils';
import PageLayout from '../PageLayout';

const mocks: MockedResponse[] = [];

it('PageLayout matches snapshot', () => {
  const { container } = render(
    <PageLayout>
      <div>Page layout children</div>
    </PageLayout>,
    { mocks }
  );
  expect(container.firstChild).toMatchSnapshot();
});

it('renders notification and it can be closed', async () => {
  const notificationContent = 'Notification content';
  const notificationTitle = 'Notification title';
  render(
    <PageLayout>
      <div>Page layout children</div>
    </PageLayout>,
    {
      mocks: [
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
                content: `<p>${notificationContent}</p>`,
              }),
            },
          },
        },
      ],
    }
  );

  const notification = await screen.findByRole('region', {
    name: /notification/i,
  });

  within(notification).getByText(notificationContent);
  within(notification).getByText(notificationTitle);

  await userEvent.click(
    within(notification).getByRole('button', {
      name: 'Sulje huomiotiedote',
    })
  );
  await sleep(100);
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
    {
      mocks: [
        {
          request: {
            query: NotificationDocument,
          },
          result: {
            data: {
              // notification with empty title and content won't be rendered
              notification: fakeNotification({ title: '', content: '' }),
            },
          },
        },
      ],
    }
  );

  await sleep(100);

  const notification = screen.queryByRole('region', {
    name: /notification/i,
  });
  expect(notification).not.toBeInTheDocument();
});
