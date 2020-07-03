import { Button, IconArrowLeft } from 'hds-react';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import {
  useEventQuery,
  OccurrenceFieldsFragment,
} from '../../generated/graphql';
import { Router } from '../../i18n';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { ROUTES } from '../app/routes/constants';
import NotFoundPage from '../notFoundPage/NotFoundPage';
import styles from './enrolmentPage.module.scss';
import EventInfo from './eventInfo/EventInfo';
import OccurrenceTable from './occurrenceTable/OccurrenceTable';

const CreateEnrolmentPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    query: { eventId },
  } = useRouter();

  const { data: eventData, loading } = useEventQuery({
    variables: { id: eventId as string },
  });

  const goToEventPage = () => {
    Router.push(ROUTES.EVENT_DETAILS.replace(':id', eventId as string));
  };

  const event = eventData?.event;
  const eventLocationId = event?.location?.id || '';
  const occurrences: OccurrenceFieldsFragment[] =
    event?.pEvent?.occurrences.edges.map(
      (edge) => edge?.node as OccurrenceFieldsFragment
    ) || [];

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
              <OccurrenceTable
                eventLocationId={eventLocationId}
                occurrences={occurrences}
              />
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
