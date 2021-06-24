import { Button, IconArrowLeft, Notification } from 'hds-react';
import omit from 'lodash/omit';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-toastify';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import {
  useEventQuery,
  useEnrolOccurrenceMutation,
  OccurrenceSeatType,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import assertUnreachable from '../../utils/assertUnreachable';
import { translateValue } from '../../utils/translateUtils';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { ROUTES } from '../app/routes/constants';
import { getEventFields } from '../event/utils';
import NotFoundPage from '../notFoundPage/NotFoundPage';
import {
  getAmountOfSeatsLeft,
  hasOccurrenceSpace,
  isEnrolmentClosed,
  isEnrolmentStarted,
  isOccurrenceCancelled,
} from '../occurrence/utils';
import { ENROLMENT_URL_PARAMS, ENROLMENT_ERRORS } from './constants';
import {
  defaultInitialValues,
  EnrolmentFormFields,
} from './enrolmentForm/constants';
import EnrolmentForm from './enrolmentForm/EnrolmentForm';
import styles from './enrolmentPage.module.scss';
import EventInfo from './eventInfo/EventInfo';
import OccurrenceTable from './occurrenceTable/OccurrenceTable';
import { getEnrolmentPayload, getCAPTCHAToken } from './utils';

const CreateEnrolmentPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const router = useRouter();
  const {
    query: { eventId, occurrences },
  } = router;

  const { data: eventData, loading } = useEventQuery({
    variables: {
      id: eventId as string,
      include: ['keywords', 'location'],
      upcomingOccurrencesOnly: true,
    },
  });

  const [enrolOccurrence] = useEnrolOccurrenceMutation();

  const goToEventPage = () => {
    router.push(ROUTES.EVENT_DETAILS.replace(':id', eventId as string));
  };

  const event = eventData?.event;
  const {
    locationId: eventLocationId,
    neededOccurrences,
    occurrences: allOccurrences,
    isMandatoryAdditionalInformationRequired,
    autoAcceptance,
  } = getEventFields(event, locale);

  const selectedOccurrences = Array.isArray(occurrences)
    ? occurrences
    : [occurrences];

  const filteredOccurrences = (allOccurrences || []).filter((o) =>
    selectedOccurrences.includes(o.id)
  );

  const initialValues = React.useMemo(
    () => ({
      ...defaultInitialValues,
      language: locale.toUpperCase(),
      // some of the values used only for validation purposes
      minGroupSize: Math.max(
        ...filteredOccurrences.map((item) => item?.minGroupSize || 0)
      ),
      // figure out maxGroup size based on all occurrences selected
      // if OccurrenceType is EnrolmentCount, use only maxGroupSize
      maxGroupSize: Math.min(
        ...filteredOccurrences.map((item) => {
          switch (item.seatType) {
            case OccurrenceSeatType.ChildrenCount:
              return Math.min(
                item?.maxGroupSize || item.amountOfSeats,
                getAmountOfSeatsLeft(item)
              );
            case OccurrenceSeatType.EnrolmentCount:
              return item?.maxGroupSize || 0;
            default:
              return assertUnreachable(item.seatType);
          }
        })
      ),
      isMandatoryAdditionalInformationRequired: !!isMandatoryAdditionalInformationRequired,
    }),
    [filteredOccurrences, locale, isMandatoryAdditionalInformationRequired]
  );

  const submit = async (values: EnrolmentFormFields) => {
    try {
      const token = await getCAPTCHAToken();
      const data = await enrolOccurrence({
        variables: {
          input: {
            ...getEnrolmentPayload({
              occurrenceIds: filteredOccurrences.map((item) => item.id),
              values,
            }),
            captchaKey: token,
          },
        },
      });
      router.push({
        pathname: ROUTES.EVENT_DETAILS.replace(':id', eventId as string),
        query: {
          ...omit(router.query, [
            ENROLMENT_URL_PARAMS.EVENT_ID,
            ENROLMENT_URL_PARAMS.OCCURRENCES,
          ]),
          [ENROLMENT_URL_PARAMS.NOTIFICATION_TYPE]:
            data.data?.enrolOccurrence?.enrolments?.[0]?.notificationType,
          [ENROLMENT_URL_PARAMS.ENROLMENT_CREATED]: true,
        },
      });
    } catch (e) {
      toast(t('enrolment:errors.createFailed'), {
        type: toast.TYPE.ERROR,
      });
    }
  };

  const error = React.useMemo(() => {
    if (!isEnrolmentStarted(event))
      return ENROLMENT_ERRORS.ENROLMENT_NOT_STARTED_ERROR;
    if (filteredOccurrences.some((o) => isEnrolmentClosed(o, event)))
      return ENROLMENT_ERRORS.ENROLMENT_CLOSED_ERROR;
    if (filteredOccurrences.some((o) => !hasOccurrenceSpace(o)))
      return ENROLMENT_ERRORS.NOT_ENOUGH_CAPACITY_ERROR;
    if (filteredOccurrences.some((o) => isOccurrenceCancelled(o)))
      return ENROLMENT_ERRORS.ENROLMENT_CANCDELLED_ERROR;
    if (neededOccurrences !== filteredOccurrences.length)
      return ENROLMENT_ERRORS.INVALID_OCCURRENCE_AMOUNT_ERROR;
    return null;
  }, [event, filteredOccurrences, neededOccurrences]);

  const title = t(`enrolment:${autoAcceptance ? 'title' : 'titleEnquiry'}`);

  return (
    <PageWrapper title={title}>
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

              <h1>{title}</h1>
              <div className={styles.divider} />

              <EventInfo event={event} />
              {error ? (
                <Notification
                  label={translateValue('enrolment:errors.label.', error, t)}
                  type="error"
                >
                  {translateValue('enrolment:errors.text.', error, t, {
                    count: neededOccurrences,
                  })}
                </Notification>
              ) : (
                <>
                  <OccurrenceTable
                    eventLocationId={eventLocationId || ''}
                    occurrences={filteredOccurrences}
                  />
                  <EnrolmentForm
                    enquiry={!autoAcceptance}
                    initialValues={initialValues}
                    onSubmit={submit}
                  />
                </>
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
