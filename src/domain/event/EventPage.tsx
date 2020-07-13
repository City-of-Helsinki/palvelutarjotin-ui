import { Notification, Button } from 'hds-react';
import take from 'lodash/take';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { useEventQuery } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import { Router } from '../../i18n';
import { translateValue } from '../../utils/translateUtils';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { ROUTES } from '../app/routes/constants';
import { ENROLMENT_URL_PARAMS } from '../enrolment/constants';
import NotFoundPage from '../notFoundPage/NotFoundPage';
import { OCCURRENCE_LIST_PAGE_SIZE } from './constants';
import EventBasicInfo from './eventBasicInfo/EventBasicInfo';
import EventImage from './eventImage/EventImage';
import styles from './eventPage.module.scss';
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

  const { data: eventData, loading } = useEventQuery({
    variables: { id: eventId as string, include: ['keywords,location'] },
  });

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
            {showEnrolmentButton && (
              <div className={styles.enrolmentButtonWrapper}>
                <Button
                  variant="primary"
                  disabled={!requiredEnrolmentsSelected}
                  style={{
                    color: !requiredEnrolmentsSelected ? 'black' : undefined,
                  }}
                  onClick={
                    requiredEnrolmentsSelected ? enrolOccurrences : undefined
                  }
                >
                  {requiredEnrolmentsSelected
                    ? t('event:occurrenceList.enrolOccurrenceButton')
                    : t(
                        'occurrence:occurrenceSelection.buttonSelectOccurrences',
                        { neededOccurrences }
                      )}
                </Button>
              </div>
            )}

            {occurrences && (
              <Occurrences
                selectOccurrence={selectOccurrence}
                deselectOccurrence={deselectOccurrence}
                selectedOccurrences={selectedOccurrences}
                enrolOccurrence={enrolOccurrence}
                event={eventData.event}
                eventLocationId={locationId || ''}
                occurrences={visibleOccurrences}
                showMoreOccurrences={showMoreOccurrences}
                showMoreButtonVisible={occurrences.length > occurrencesVisible}
                neededOccurrences={neededOccurrences}
              />
            )}
          </Container>
        ) : (
          <NotFoundPage />
        )}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default EventPage;
