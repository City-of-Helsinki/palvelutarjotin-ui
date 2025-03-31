import { Notification } from 'hds-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { ReactElement } from 'react';

import EnrolmentButton from './enrolmentButton/EnrolmentButton';
import { EnrolmentFormContainer } from './EnrolmentFormContainer';
import EventBasicInfo from './eventBasicInfo/EventBasicInfo';
import { EventHero } from './EventHero';
import styles from './eventPage.module.scss';
import EventPageMeta from './eventPageMeta/EventPageMeta';
import Occurrences from './occurrences/OccurrencesTable';
import { QueueFormContainer } from './QueryFormContainer';
import { getEventFields, shouldEventSupportQueueEnrolments } from './utils';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import ShareLinks from '../../common/components/shareLinks/ShareLinks';
import { useEventQuery } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import type { I18nNamespace } from '../../types';
import { translateValue } from '../../utils/translateUtils';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { ENROLMENT_URL_PARAMS } from '../enrolment/constants';
import NotFoundPage from '../notFoundPage/NotFoundPage';
import { isEnrolmentStarted } from '../occurrence/utils';

const EventPage = (): ReactElement => {
  const { t } = useTranslation<I18nNamespace>();
  const locale = useLocale();
  const {
    query: { eventId, ...query },
  } = useRouter();
  const enrolmentCreated = query[ENROLMENT_URL_PARAMS.ENROLMENT_CREATED];
  const queueCreated = query[ENROLMENT_URL_PARAMS.QUEUE_CREATED];
  const notificationType = query[ENROLMENT_URL_PARAMS.NOTIFICATION_TYPE];
  const [selectedOccurrences, setSelectedOccurrences] = React.useState<
    string[]
  >([]);

  const [showEnrolmentForm, setShowEnrolmentForm] = React.useState(false);
  const [showQueueForm, setShowQueueForm] = React.useState(false);

  const {
    data: eventData,
    loading,
    refetch: refetchEvent,
  } = useEventQuery({
    variables: {
      id: eventId as string,
      include: ['keywords', 'location', 'audience', 'in_language'],
      upcomingOccurrencesOnly: true,
    },
  });
  const event = eventData?.event;

  // refetch event data (to get updated occurrences) if enrolment was created
  React.useEffect(() => {
    if (enrolmentCreated) {
      refetchEvent();
    }
  }, [enrolmentCreated, refetchEvent]);

  const enrolOccurrences = () => {
    setShowEnrolmentForm(() => true);
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

  const handleOnEnrol = () => {
    setSelectedOccurrences([]);
    setShowEnrolmentForm(false);
    refetchEvent();
  };

  const handleOnQueue = () => {
    setSelectedOccurrences([]);
    setShowQueueForm(false);
    refetchEvent();
  };

  const {
    eventName,
    imageUrl,
    imageAltText,
    photographerName,
    occurrences,
    locationId,
    neededOccurrences,
    autoAcceptance,
  } = getEventFields(eventData?.event, locale);

  const requiredEnrolmentsSelected =
    selectedOccurrences.length === (neededOccurrences || 0);
  const showEnrolmentButton =
    !!event &&
    !!neededOccurrences &&
    neededOccurrences > 1 &&
    isEnrolmentStarted(event);

  // Show the queue controls only when the enrolments has started and they are handled internally
  const isQueueEnrolmentAvailable = shouldEventSupportQueueEnrolments(event);

  return (
    <PageWrapper title={eventName || t('event:pageTitle')}>
      <LoadingSpinner isLoading={loading}>
        {eventData?.event ? (
          <div>
            <EventHero
              imageUrl={imageUrl}
              imageAltText={imageAltText || t('event:eventImageAltText')}
              photographerName={photographerName}
            />
            <Container className={styles.eventPage}>
              <EventPageMeta event={eventData?.event} />
              {enrolmentCreated && (
                <Notification
                  label={t(
                    `event:enrolmentConfirmation.${
                      autoAcceptance ? 'title' : 'titleEnquiry'
                    }`
                  )}
                  type={autoAcceptance ? 'success' : 'alert'}
                  className={styles.eventPageNotification}
                >
                  {notificationType &&
                    translateValue(
                      'event:enrolmentConfirmation.sentBy.',
                      notificationType as string,
                      t
                    )}
                </Notification>
              )}
              {queueCreated && (
                <Notification
                  label={t(`enrolment:queue.success`)}
                  type="success"
                  className={styles.eventPageNotification}
                />
              )}
              <EventBasicInfo event={eventData.event} />

              {occurrences && (
                <div
                  className={styles.occurrencesContainer}
                  data-testid="occurrences-section"
                >
                  <Occurrences
                    selectOccurrence={selectOccurrence}
                    deselectOccurrence={deselectOccurrence}
                    selectedOccurrences={selectedOccurrences}
                    event={eventData.event}
                    eventLocationId={locationId || ''}
                    occurrences={occurrences}
                    neededOccurrences={neededOccurrences}
                    hideLoadMoreButton={showEnrolmentForm}
                  />
                </div>
              )}
              {showEnrolmentButton && !showEnrolmentForm && (
                <EnrolmentButton
                  enrolOccurrences={enrolOccurrences}
                  neededOccurrences={neededOccurrences}
                  requiredEnrolmentsSelected={requiredEnrolmentsSelected}
                />
              )}
              {showEnrolmentForm && (
                <EnrolmentFormContainer
                  event={eventData.event}
                  handleOnEnrol={handleOnEnrol}
                  neededOccurrences={neededOccurrences}
                  occurrences={occurrences}
                  selectedOccurrences={selectedOccurrences}
                  setShowEnrolmentForm={setShowEnrolmentForm}
                  showEnrolmentForm={showEnrolmentButton}
                />
              )}
              {isQueueEnrolmentAvailable && (
                <QueueFormContainer
                  event={eventData.event}
                  handleOnQueue={handleOnQueue}
                  setShowQueueForm={setShowQueueForm}
                  showQueueForm={showQueueForm}
                />
              )}
              <div className={styles.sharePart}>
                <div></div>
                <div>
                  <ShareLinks title={t('event:shareLinks.title')} />
                </div>
              </div>
            </Container>
          </div>
        ) : (
          <NotFoundPage />
        )}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default EventPage;
