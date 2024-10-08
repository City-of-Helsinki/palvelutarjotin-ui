import { advanceTo } from 'jest-date-mock';
import * as React from 'react';

import {
  Notification,
  NotificationDocument,
} from '../../../../generated/graphql-cms';
import { fakeNotification } from '../../../../utils/cmsMockDataUtils';
import {
  render,
  screen,
  userEvent,
  waitFor,
  sleep,
} from '../../../../utils/testUtils';
import HeaderNotification, {
  NOTIFICATION_STORAGE_KEY,
} from '../HeaderNotification';

const notificationTitle = 'Notification title';
const notificationContent = 'Notification content';

const renderComponent = (notification: Partial<Notification> = {}) => {
  return render(<HeaderNotification />, {
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
              ...notification,
            }),
          },
        },
      },
    ],
  });
};

beforeEach(() => {
  advanceTo(new Date(2020, 7, 10));
});

it('matches snapshot', async () => {
  const { container } = renderComponent({
    linkUrl: 'https://kultus.hel.fi',
    level: 'info',
    title: 'Notification title',
    content: 'Notification content',
    linkText: 'link text',
  });
  await sleep(100);

  expect(container).toMatchSnapshot();
});

it('renders notification data correctly', async () => {
  const title = 'Notification title';
  const content = 'Notification content';
  const linkUrl = 'https://kultus.hel.fi';
  const linkText = 'Linkki sivustolle';
  renderComponent({
    startDate: new Date(2020, 6, 10).toISOString(),
    endDate: new Date(2020, 10, 10).toISOString(),
    title,
    content: `<p>${content}</p>`,
    linkUrl,
    linkText,
  });

  await screen.findByText(title);
  screen.getByText(content);
  screen.getByRole('link', {
    name: /Linkki sivustolle avautuu uudessa välilehdessä/i,
  });
  await sleep(100);

  await userEvent.click(
    screen.getByRole('button', {
      name: 'Sulje huomiotiedote',
    })
  );

  await waitFor(() => {
    expect(screen.queryByText(content)).not.toBeInTheDocument();
  });
});

it('saves notification state to local storage', async () => {
  renderComponent();

  await screen.findByText(notificationContent);

  const localStorageObject = JSON.parse(
    localStorage.getItem(NOTIFICATION_STORAGE_KEY) as string
  );
  await sleep(100);

  expect(localStorageObject).toEqual({
    isVisible: true,
    closedNotificationHash: null,
  });

  await userEvent.click(
    screen.getByRole('button', {
      name: 'Sulje huomiotiedote',
    })
  );

  await sleep(100);

  const localStorageObjectAfterClosing = JSON.parse(
    localStorage.getItem(NOTIFICATION_STORAGE_KEY) as string
  );

  expect(localStorageObjectAfterClosing).toMatchInlineSnapshot(`
    {
      "closedNotificationHash": "6176514228182135",
      "isVisible": false,
    }
  `);

  expect(screen.queryByText(notificationContent)).not.toBeInTheDocument();
});

it('render notification even if title is missing', async () => {
  renderComponent({
    title: '',
  });

  await screen.findByText(notificationContent);
});

it('renders error-level notification if level is high', async () => {
  renderComponent({
    level: 'high',
  });

  const notification = await screen.findByRole('region', {
    name: /notification/i,
  });

  expect(notification.className).toContain('Notification-module_error');
});

it('renders default notification if level is low', async () => {
  renderComponent({
    level: 'low',
  });

  const notification = await screen.findByRole('region', {
    name: /notification/i,
  });

  expect(notification.className).not.toContain('Notification-module_error');
  expect(notification.className).not.toContain('Notification-module_alert');
});

it('renders aler-level notification if level is info', async () => {
  renderComponent({
    level: 'info',
  });

  const notification = await screen.findByRole('region', {
    name: /notification/i,
  });

  expect(notification.className).toContain('Notification-module_alert');
});

it('renders notification if endDate is same day', async () => {
  const title = 'Notification title';
  renderComponent({
    endDate: new Date(2020, 7, 10).toISOString(),
    title,
  });

  await screen.findByText(title);
});

it('renders notification if endDate is in the future', async () => {
  const title = 'Notification title';
  renderComponent({
    endDate: new Date(2020, 10, 10).toISOString(),
    title,
  });

  await screen.findByText(title);
});

it("doesn't render notification if startDate is in the future", async () => {
  const title = 'Notification title';
  renderComponent({
    startDate: new Date(2020, 10, 10).toISOString(),
    title,
  });

  await sleep(100);
  expect(screen.queryByText(title)).not.toBeInTheDocument();
});

it("doesn't render notification if endDate is in the past", async () => {
  const title = 'Notification title';
  renderComponent({
    endDate: new Date(2020, 6, 10).toISOString(),
    title,
  });

  await sleep(100);
  expect(screen.queryByText(title)).not.toBeInTheDocument();
});

it('renders notification if startDate is in the past and endDate is in the future', async () => {
  const title = 'Notification title';
  renderComponent({
    endDate: new Date(2020, 10, 10).toISOString(),
    startDate: new Date(2020, 6, 10).toISOString(),
    title,
  });

  await sleep(100);
  await screen.findByText(title);
});
