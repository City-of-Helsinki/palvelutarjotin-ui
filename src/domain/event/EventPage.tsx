import { Notification } from 'hds-react';
import take from 'lodash/take';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import ShareLinks from '../../common/components/shareLinks/ShareLinks';
import { useEventQuery } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import { Router, useTranslation } from '../../i18n';
import { translateValue } from '../../utils/translateUtils';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { ROUTES } from '../app/routes/constants';
import { ENROLMENT_URL_PARAMS } from '../enrolment/constants';
import NotFoundPage from '../notFoundPage/NotFoundPage';
import { OCCURRENCE_LIST_PAGE_SIZE } from './constants';
import EnrolmentButton from './enrolmentButton/EnrolmentButton';
import EventBasicInfo from './eventBasicInfo/EventBasicInfo';
import EventImage from './eventImage/EventImage';
import styles from './eventPage.module.scss';
import EventPageMeta from './eventPageMeta/EventPageMeta';
import Occurrences from './occurrences/Occurrences';
import { getEventFields } from './utils';

const EventPage = (): ReactElement => {
  const { t } = useTranslation();
  const locale = useLocale();
  const {
    query: { eventId, ...query },
  } = useRouter();
  const enrolmentCreated = query[ENROLMENT_URL_PARAMS.ENROLMENT_CREATED];
  const notificationType = query[ENROLMENT_URL_PARAMS.NOTIFICATION_TYPE];
  const [occurrencesVisible, setOccurrencesVisible] = React.useState(
    OCCURRENCE_LIST_PAGE_SIZE
  );
  const [selectedOccurrences, setSelectedOccurrences] = React.useState<
    string[]
  >([]);

  const { data: eventData, loading, refetch: refetchEvent } = useEventQuery({
    variables: {
      id: eventId as string,
      include: ['keywords', 'location', 'audience'],
      upcomingOccurrencesOnly: true,
    },
  });

  // refetch event data (to get updated occurrences) if enrolment was created
  React.useEffect(() => {
    if (enrolmentCreated) {
      refetchEvent();
    }
  }, [enrolmentCreated, refetchEvent]);

  const enrolOccurrence = (occurrenceId: string) => {
    Router.push({
      pathname: ROUTES.CREATE_ENROLMENT.replace(':id', eventId as string),
      query: {
        occurrences: occurrenceId,
      },
    });
  };

  const enrolOccurrences = () => {
    Router.push({
      pathname: ROUTES.CREATE_ENROLMENT.replace(':id', eventId as string),
      query: {
        occurrences: selectedOccurrences,
      },
    });
  };

  const showMoreOccurrences = () => {
    setOccurrencesVisible(occurrencesVisible + OCCURRENCE_LIST_PAGE_SIZE);
  };

  const selectOccurrence = (occurrenceId: string) => {
    setSelectedOccurrences((selectOccurrences) => [
      ...selectOccurrences,
      occurrenceId,
    ]);
  };

  const deselectOccurrence = (occurrenceId: string) => {
    setSelectedOccurrences((selectedOccurrences) =>
      selectedOccurrences.filter((id) => id !== occurrenceId)
    );
  };

  const {
    eventName,
    imageUrl,
    imageAltText,
    photographerName,
    occurrences,
    locationId,
    neededOccurrences,
  } = getEventFields(eventData?.event, locale);

  const visibleOccurrences = take(occurrences, occurrencesVisible);
  const requiredEnrolmentsSelected =
    selectedOccurrences.length === (neededOccurrences || 0);
  const showEnrolmentButton = neededOccurrences && neededOccurrences > 1;

  return (
    <PageWrapper title={eventName || t('event:pageTitle')}>
      <LoadingSpinner isLoading={loading}>
        {eventData?.event ? (
          <Container className={styles.eventPage}>
            <EventPageMeta event={eventData?.event} />
            {enrolmentCreated && (
              <Notification
                label={t('event:enrolmentConfirmation.title')}
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
              imageAltText={imageAltText || t('event:eventImageAltText')}
              photographerName={photographerName}
            />
            <EventBasicInfo event={eventData.event} />
            {showEnrolmentButton && (
              <EnrolmentButton
                enrolOccurrences={enrolOccurrences}
                neededOccurrences={neededOccurrences}
                requiredEnrolmentsSelected={requiredEnrolmentsSelected}
              />
            )}
            {occurrences && (
              <div data-testid="occurrences-section">
                <Occurrences
                  selectOccurrence={selectOccurrence}
                  deselectOccurrence={deselectOccurrence}
                  selectedOccurrences={selectedOccurrences}
                  enrolOccurrence={enrolOccurrence}
                  event={eventData.event}
                  eventLocationId={locationId || ''}
                  occurrences={visibleOccurrences}
                  showMoreOccurrences={showMoreOccurrences}
                  showMoreButtonVisible={
                    occurrences.length > occurrencesVisible
                  }
                  neededOccurrences={neededOccurrences}
                />
              </div>
            )}
            <div className={styles.sharePart}>
              <div></div>
              <div>
                <ShareLinks title={t('event:shareLinks.title')} />
              </div>
            </div>
          </Container>
        ) : (
          <NotFoundPage />
        )}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default EventPage;
