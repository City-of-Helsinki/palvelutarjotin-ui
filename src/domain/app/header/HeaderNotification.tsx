import isFuture from 'date-fns/isFuture';
import isPast from 'date-fns/isPast';
import isSameDay from 'date-fns/isSameDay';
import { Notification, NotificationType } from 'hds-react';
import { useTranslation } from 'next-i18next';
import * as React from 'react';
import useLocalStorage from 'react-use/lib/useLocalStorage';

import ExternalLink from '../../../common/components/externalLink/ExternalLink';
import {
  Notification as NotificationNode,
  useNotificationQuery,
} from '../../../generated/graphql-cms';
import useLocale from '../../../hooks/useLocale';
import hash from '../../../utils/hash';
import { useCMSApolloClient } from '../../headless-cms/apollo/apolloClient';

export const NOTIFICATION_STORAGE_KEY = 'header-notification';

type CmsNotificationTypes = 'info' | 'high' | 'low';

// used to get content from inside p-tag (wordpress returns content as html)
const contentRegex = /<p>(.*)<\/p>/i;

type NotificationState = {
  isVisible: boolean;
  closedNotificationHash: string | null | undefined;
};

const notificationTypeMap: Record<CmsNotificationTypes, NotificationType> = {
  info: 'alert',
  high: 'error',
  low: 'info',
};

const HeaderNotification: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [notificationState, setNotificationState] =
    useLocalStorage<NotificationState>(NOTIFICATION_STORAGE_KEY, {
      isVisible: true,
      closedNotificationHash: null,
    });
  const { isVisible, closedNotificationHash } = notificationState ?? {};
  const cmsApolloClient = useCMSApolloClient();

  const { data } = useNotificationQuery({
    client: cmsApolloClient,
    variables: {
      language: locale ?? 'fi',
    },
    onCompleted: (data) => {
      const notification = data.notification;
      if (notification) {
        const notificationHash = getNotificationHash(notification).toString();
        if (closedNotificationHash !== notificationHash) {
          setNotificationState({
            isVisible: true,
            closedNotificationHash: null,
          });
        }
      }
    },
  });

  const notification = data?.notification;
  const parsedContent = contentRegex.exec(notification?.content ?? '')?.[1];
  const { title, level, linkText, linkUrl } = notification ?? {};

  const handleCloseNotification = () => {
    setNotificationState({
      isVisible: false,
      closedNotificationHash: notification
        ? getNotificationHash(notification).toString()
        : null,
    });
  };

  return isNotificationActive(notification) && isVisible ? (
    <Notification
      type={notificationTypeMap[(level as CmsNotificationTypes) ?? 'info']}
      label={title ?? undefined}
      dismissible={true}
      closeButtonLabelText={
        t('header:notification:labelCloseNotification') as string
      }
      onClose={handleCloseNotification}
    >
      {parsedContent}
      {linkUrl && (
        <>
          <ExternalLink
            href={linkUrl}
            style={{ marginTop: '1rem', display: 'block' }}
          >
            {linkText}
          </ExternalLink>
        </>
      )}
    </Notification>
  ) : null;
};

const getNotificationHash = (notification: NotificationNode) => {
  // notification fields used to build string for unique hash
  const stringKeys = [
    'title',
    'content',
    'linkText',
    'linkUrl',
    'level',
    'endDate',
    'startDate',
  ] as const;
  const combinedString = stringKeys.reduce(
    (combinedString, current) =>
      (combinedString ?? '') + (notification[current] ?? ''),
    ''
  );
  return hash(combinedString);
};

const isNotificationActive = (notification?: NotificationNode | null) => {
  const { startDate, endDate, title, content } = notification ?? {};
  const isNotificationContentMissing = !content && !title;

  if (!notification || isNotificationContentMissing) return false;

  const isSameDayOrFuture = (date: Date) =>
    isSameDay(new Date(), date) || isFuture(date);

  return [
    // both start and end dates are defined
    () =>
      startDate &&
      endDate &&
      isPast(new Date(startDate)) &&
      isSameDayOrFuture(new Date(endDate)),
    // only end date defined
    () => !startDate && endDate && isSameDayOrFuture(new Date(endDate)),
    // only start date defined
    () => startDate && !endDate && isPast(new Date(startDate)),
    // neither start or end date are defined
    () => !startDate && !endDate,
  ].some((f) => !!f());
};

export default HeaderNotification;
