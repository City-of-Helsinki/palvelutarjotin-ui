import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { useEventQuery } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import getLocalisedString from '../../utils/getLocalisedString';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import NotFoundPage from '../notFoundPage/NotFoundPage';
import EventBasicInfo from './eventBasicInfo/EventBasicInfo';
import EventImage from './eventImage/EventImage';
import styles from './eventPage.module.scss';
import { getEventFields } from './utils';

const EventPage = (): ReactElement => {
  const { t } = useTranslation();
  const locale = useLocale();
  const {
    query: { eventId },
  } = useRouter();

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
