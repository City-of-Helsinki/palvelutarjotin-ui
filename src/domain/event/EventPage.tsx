/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from 'classnames';
import { Notification, IconArrowLeft, Button, IconAngleUp } from 'hds-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { ReactElement } from 'react';

import EnrolmentButton from './enrolmentButton/EnrolmentButton';
import EventBasicInfo from './eventBasicInfo/EventBasicInfo';
import EventImage from './eventImage/EventImage';
import styles from './eventPage.module.scss';
import EventPageMeta from './eventPageMeta/EventPageMeta';
import EnrolmentFormSection from './occurrences/EnrolmentFormSection';
import Occurrences from './occurrences/OccurrencesTable';
import QueueFormSection from './occurrences/QueueFormSection';
import { getEventFields } from './utils';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import ShareLinks from '../../common/components/shareLinks/ShareLinks';
import {
  EventFieldsFragment,
  OccurrenceFieldsFragment,
  useEventQuery,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import { extractLatestReturnPath } from '../../utils/extractLatestReturnPath';
import { translateValue } from '../../utils/translateUtils';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { ENROLMENT_URL_PARAMS } from '../enrolment/constants';
import NotFoundPage from '../notFoundPage/NotFoundPage';
import { isEnrolmentStarted } from '../occurrence/utils';

const EventPage = (): ReactElement => {
  const { t } = useTranslation();
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
              <QueueFormContainer
                event={eventData.event}
                handleOnQueue={handleOnQueue}
                setShowQueueForm={setShowQueueForm}
                showQueueForm={showQueueForm}
              />
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

const EventHero: React.FC<{
  imageUrl?: string;
  imageAltText?: string | null;
  photographerName?: string | null;
}> = ({ imageAltText, imageUrl, photographerName }) => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const [, search] = asPath.split('?');
  const { returnPath, remainingQueryString } = extractLatestReturnPath(search);

  return (
    <div className={styles.eventHero}>
      <Container className={styles.backButtonContainer}>
        <Link href={{ pathname: returnPath, search: remainingQueryString }}>
          <a aria-label={t('common:buttonBack')}>
            <IconArrowLeft size="m" />
          </a>
        </Link>
      </Container>
      <EventImage
        imageUrl={imageUrl}
        imageAltText={imageAltText || t('event:eventImageAltText')}
        photographerName={photographerName}
      />
    </div>
  );
};

const EnrolmentFormContainer: React.FC<{
  neededOccurrences?: number;
  showEnrolmentForm: boolean;
  selectedOccurrences: string[];
  setShowEnrolmentForm: (a: boolean) => void;
  event: EventFieldsFragment;
  occurrences?: OccurrenceFieldsFragment[];
  handleOnEnrol: () => void;
}> = ({
  neededOccurrences,
  showEnrolmentForm,
  selectedOccurrences,
  setShowEnrolmentForm,
  event,
  occurrences,
  handleOnEnrol,
}) => {
  const { t } = useTranslation();
  const enrolmentFormRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    enrolmentFormRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [showEnrolmentForm]);

  return (
    <div className={styles.enrolmentFormContainer}>
      {showEnrolmentForm &&
        selectedOccurrences.length !== neededOccurrences && (
          <Notification
            style={{ marginTop: 'var(--spacing-xl)' }}
            label={t('enrolment:enrolmentForm.labelChooseRequiredOccurrences', {
              amount: neededOccurrences,
            })}
            type="alert"
          >
            {t('enrolment:enrolmentForm.descriptionChooseRequiredOccurrences')}
          </Notification>
        )}
      <div
        className={classNames(styles.enrolmentFormSection, {
          [styles.hideEnrolmentForm]:
            selectedOccurrences.length !== neededOccurrences,
        })}
        ref={enrolmentFormRef}
      >
        <Button
          className={styles.cancelEnrolmentButton}
          variant="supplementary"
          iconRight={<IconAngleUp />}
          onClick={() => setShowEnrolmentForm(false)}
        >
          {t('enrolment:enrolmentForm.buttonCancelAndCloseForm')}
        </Button>
        <EnrolmentFormSection
          event={event}
          occurrences={
            occurrences?.filter((o) => selectedOccurrences.includes(o.id)) ?? []
          }
          onCloseForm={() => setShowEnrolmentForm(false)}
          onEnrol={handleOnEnrol}
        />
      </div>
    </div>
  );
};

const QueueFormContainer: React.FC<{
  showQueueForm: boolean;
  setShowQueueForm: (a: boolean) => void;
  event: EventFieldsFragment;
  handleOnQueue: () => void;
}> = ({ showQueueForm, setShowQueueForm, event, handleOnQueue }) => {
  const { t } = useTranslation();
  const queueFormRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    queueFormRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [showQueueForm]);

  return (
    <>
      <h2 className={styles.enrolmentHeader}>{t('enrolment:queue.title')}</h2>
      {showQueueForm ? (
        <div className={styles.enrolmentFormContainer}>
          <div className={styles.enrolmentFormSection} ref={queueFormRef}>
            <div className={styles.closeQueueFormButtonWrapper}>
              <div className={styles.enrolmentText}>
                {t('enrolment:queue.enrolText')}
              </div>
              <Button
                variant="supplementary"
                iconRight={<IconAngleUp />}
                onClick={() => setShowQueueForm(false)}
              >
                {t('enrolment:enrolmentForm.buttonCancelAndCloseForm')}
              </Button>
            </div>
            <QueueFormSection
              event={event}
              onCloseForm={() => setShowQueueForm(false)}
              onQueue={handleOnQueue}
            />
          </div>
        </div>
      ) : (
        <div className={styles.queueInfoContainer}>
          <div className={styles.enrolmentText}>
            {t('enrolment:queue.enrolText')}
          </div>
          <Button onClick={() => setShowQueueForm(true)}>
            {t('enrolment:queue.enrol')}
          </Button>
        </div>
      )}
    </>
  );
};

export default EventPage;
