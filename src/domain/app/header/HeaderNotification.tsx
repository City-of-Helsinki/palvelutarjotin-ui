import { Notification, NotificationType } from 'hds-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useNotificationQuery } from '../../../generated/graphql-cms';
import { useCMSClient } from '../../../headless-cms/cmsApolloContext';

type CmsNotificationTypes = 'info' | 'high' | 'low';

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
  const parsedContent = /<p>(.*)<\/p>/i.exec(notification?.content ?? '')?.[1];
  const { title, level } = notification ?? {};

  return notification && isVisible ? (
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
    </Notification>
  ) : null;
};

export default HeaderNotification;
