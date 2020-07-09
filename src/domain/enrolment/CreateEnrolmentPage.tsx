import { Button, IconArrowLeft, Notification } from 'hds-react';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { useEventQuery } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import { Router } from '../../i18n';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { ROUTES } from '../app/routes/constants';
import { getEventFields } from '../event/utils';
import NotFoundPage from '../notFoundPage/NotFoundPage';
import EnrolmentForm, {
  EnrolmentFormFields,
} from './enrolmentForm/EnrolmentForm';
import styles from './enrolmentPage.module.scss';
import EventInfo from './eventInfo/EventInfo';
import OccurrenceTable from './occurrenceTable/OccurrenceTable';

const CreateEnrolmentPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const {
    query: { eventId, occurrences },
  } = useRouter();

  const { data: eventData, loading } = useEventQuery({
    variables: { id: eventId as string, include: ['location'] },
  });

  const goToEventPage = () => {
    Router.push(ROUTES.EVENT_DETAILS.replace(':id', eventId as string));
  };

  const event = eventData?.event;
  const {
    locationId: eventLocationId,
    neededOccurrences,
    occurrences: allOccurrences,
  } = getEventFields(event, locale);

  const selectedOccurrences = Array.isArray(occurrences)
    ? occurrences
    : [occurrences];

  const filteredOccurrences = (allOccurrences || []).filter((o) =>
    selectedOccurrences.includes(o.id)
  );

  const areSelectedOccurrencesValid =
    neededOccurrences === filteredOccurrences.length;

  const submit = (values: EnrolmentFormFields) => {
    console.log(values);
  };
  return (
    <PageWrapper title={t('enrolment:pageTitle')}>
      <LoadingSpinner isLoading={loading}>
        {event ? (
          <div className={styles.enrolmentPage}>
            <Container>
              <div className={styles.buttonWrapper}>
                <Button
                  iconLeft={<IconArrowLeft />}
                  onClick={goToEventPage}
                  variant="secondary"
                >
                  {t('enrolment:buttonBack')}
                </Button>
              </div>

              <h1>{t('enrolment:title')}</h1>
              <div className={styles.divider} />

              <EventInfo event={event} />
              {areSelectedOccurrencesValid ? (
                <>
                  <OccurrenceTable
                    eventLocationId={eventLocationId || ''}
                    occurrences={filteredOccurrences}
                  />
                  <EnrolmentForm onSubmit={submit} />
                </>
              ) : (
                <Notification
                  labelText={t('enrolment:labelInvalidOccurrenceAmount')}
                  type="error"
                >
                  {t('enrolment:textInvalidOccurrenceAmount', {
                    count: neededOccurrences,
                  })}
                </Notification>
              )}
            </Container>
          </div>
        ) : (
          <NotFoundPage />
        )}
      </LoadingSpinner>
    </PageWrapper>
  );
};

export default CreateEnrolmentPage;
