import isFuture from 'date-fns/isFuture';
import isPast from 'date-fns/isPast';
import isSameDay from 'date-fns/isSameDay';
import { Notification, NotificationType } from 'hds-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import ExternalLink from '../../../common/components/externalLink/ExternalLink';
import {
  Notification as NotificationNode,
  useNotificationQuery,
} from '../../../generated/graphql-cms';
import { useCMSClient } from '../../../headless-cms/cmsApolloContext';

type CmsNotificationTypes = 'info' | 'high' | 'low';

// used to get content from inside p-tag (wordpress returns content as html)
const contentRegex = /<p>(.*)<\/p>/i;

const notificationTypeMap: Record<CmsNotificationTypes, NotificationType> = {
  info: 'alert',
  high: 'error',
  low: 'info',
};

const HeaderNotification: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = React.useState(true);
  const { data } = useNotificationQuery({
    client: useCMSClient(),
  });
  const notification = data?.notification;
  const parsedContent = contentRegex.exec(notification?.content ?? '')?.[1];
  const { title, level, linkText, linkUrl } = notification ?? {};

  return isNotificationActive(notification) && isVisible ? (
    <Notification
      type={notificationTypeMap[(level as CmsNotificationTypes) ?? 'info']}
      label={title ?? undefined}
      dismissible={true}
      closeButtonLabelText={
        t('header:notification:labelCloseNotification') as string
      }
      onClose={() => setIsVisible(false)}
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