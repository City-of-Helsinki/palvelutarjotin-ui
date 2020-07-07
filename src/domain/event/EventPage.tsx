import { Notification } from 'hds-react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { useEventQuery } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import { translateValue } from '../../utils/translateUtils';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { ENROLMENT_URL_PARAMS } from '../enrolment/constants';
import NotFoundPage from '../notFoundPage/NotFoundPage';
import EventBasicInfo from './eventBasicInfo/EventBasicInfo';
import EventImage from './eventImage/EventImage';
import styles from './eventPage.module.scss';
import { getEventFields } from './utils';

const EventPage = (): ReactElement => {
  const { t } = useTranslation();
  const locale = useLocale();
  const {
    query: { eventId, ...query },
  } = useRouter();
  const enrolmentCreated = query[ENROLMENT_URL_PARAMS.ENROLMENT_CREATED];
  const notificationType = query[ENROLMENT_URL_PARAMS.NOTIFICATION_TYPE];

  const { data: eventData, loading } = useEventQuery({
    variables: { id: eventId as string },
  });

  const {
    eventName,
    imageUrl,
    imageAltText,
    photographerName,
  } = getEventFields(eventData?.event, locale);

  return (
    <PageWrapper title={eventName || t('event:pageTitle')}>
      <LoadingSpinner isLoading={loading}>
        {eventData?.event ? (
          <Container className={styles.eventPage}>
            {enrolmentCreated && (
              <Notification
                labelText={t('event:enrolmentConfirmation.title')}
                type="success"
              >
                {notificationType &&
                  translateValue(
                    'event:enrolmentConfirmation.sentBy.',
                    notificationType as string,
                    t
                  )}
              </Notification>
            )}
            <EventImage
              imageUrl={imageUrl}
              imageAltText={imageAltText}
              photographerName={photographerName}
            />
            <EventBasicInfo event={eventData.event} />
          </Container>
        ) : (
          <NotFoundPage />
        )}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default EventPage;
