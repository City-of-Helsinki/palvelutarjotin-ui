import { isFuture, isPast, isSameDay, isValid as isValidDate } from 'date-fns';
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
import type { I18nNamespace } from '../../../types';
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
  const { t } = useTranslation<I18nNamespace>();
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

const isValidDateString = (dateString: string | null | undefined): boolean => {
  if (
    !dateString ||
    typeof dateString !== 'string' ||
    dateString.trim() === ''
  ) {
    return false;
  }
  return isValidDate(new Date(dateString));
};

const isNotificationActive = (notification?: NotificationNode | null) => {
  const { startDate, endDate, title, content } = notification ?? {};
  const isNotificationContentMissing = !content && !title;

  if (!notification || isNotificationContentMissing) return false;

  // Validate dates once at the beginning
  const isStartDateValid = isValidDateString(startDate);
  const isEndDateValid = isValidDateString(endDate);

  const isSameDayOrFuture = (date: Date) =>
    isSameDay(new Date(), date) || isFuture(date);

  return [
    // both start and end dates are defined
    () =>
      isStartDateValid &&
      isEndDateValid &&
      isPast(new Date(startDate!)) &&
      isSameDayOrFuture(new Date(endDate!)),
    // only end date defined
    () =>
      !isStartDateValid &&
      isEndDateValid &&
      isSameDayOrFuture(new Date(endDate!)),
    // only start date defined
    () => isStartDateValid && !isEndDateValid && isPast(new Date(startDate!)),
    // neither start or end date are defined
    () => !isStartDateValid && !isEndDateValid,
  ].some((f) => !!f());
};

export default HeaderNotification;
