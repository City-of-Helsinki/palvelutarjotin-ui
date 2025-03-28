import { isApolloError } from '@apollo/client';
import { omit } from 'lodash';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { toast } from 'react-toastify';

import { TOAST_AUTO_CLOSE_DURATION_MS } from '../../../constants';
import {
  OccurrenceFieldsFragment,
  EventFieldsFragment,
  useEnrolOccurrenceMutation,
  OccurrencesOccurrenceSeatTypeChoices,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { saveDataForRecommendedEventsQuery } from '../../../utils/recommendedEventsUtils';
import { assertUnreachable } from '../../../utils/typescript.utils';
import { ROUTES } from '../../app/routes/constants';
import {
  ENROLMENT_ERRORS,
  ENROLMENT_URL_PARAMS,
} from '../../enrolment/constants';
import {
  EnrolmentFormFields,
  defaultEnrolmentInitialValues,
} from '../../enrolment/enrolmentForm/constants';
import EnrolmentForm from '../../enrolment/enrolmentForm/EnrolmentForm';
import { getCAPTCHAToken, getEnrolmentPayload } from '../../enrolment/utils';
import { getAmountOfSeatsLeft } from '../../occurrence/utils';
import { getEventFields } from '../utils';

const EnrolmentFormSection: React.FC<{
  occurrences: OccurrenceFieldsFragment[];
  event: EventFieldsFragment;
  onCloseForm: () => void;
  onEnrol?: () => void;
}> = ({ event, occurrences, onCloseForm, onEnrol }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const router = useRouter();
  const [enrolOccurrence, { loading: enrolmentLoading }] =
    useEnrolOccurrenceMutation();

  const { isMandatoryAdditionalInformationRequired, autoAcceptance } =
    getEventFields(event, locale);

  const submit = async (values: EnrolmentFormFields) => {
    try {
      const token = await getCAPTCHAToken();
      const data = await enrolOccurrence({
        variables: {
          input: {
            ...getEnrolmentPayload({
              occurrenceIds: occurrences.map((o) => o.id),
              values,
            }),
            captchaKey: token,
          },
        },
      });
      saveDataForRecommendedEventsQuery(values);
      router.push({
        pathname: ROUTES.EVENT_DETAILS.replace(':id', event.id as string),
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
      onEnrol?.();
    } catch (e) {
      const isNotEnoughCapacityError =
        e instanceof Error &&
        isApolloError(e) &&
        e.graphQLErrors[0]?.extensions?.code ===
          ENROLMENT_ERRORS.NOT_ENOUGH_CAPACITY_ERROR;

      toast(
        isNotEnoughCapacityError
          ? t('enrolment:errors.createFailedBecauseNotEnoughCapacity')
          : t('enrolment:errors.createFailed'),
        {
          type: 'error',
          autoClose: TOAST_AUTO_CLOSE_DURATION_MS,
        }
      );
    }
  };

  const initialValues = React.useMemo(
    () => ({
      ...defaultEnrolmentInitialValues,
      language: locale.toUpperCase(),
      isMandatoryAdditionalInformationRequired:
        !!isMandatoryAdditionalInformationRequired,
    }),
    [locale, isMandatoryAdditionalInformationRequired]
  );

  const { minGroupSize, maxGroupSize } = React.useMemo(
    () => ({
      // some of the values used only for validation purposes
      minGroupSize: Math.max(
        ...occurrences.map((item) => item?.minGroupSize || 0)
      ),
      // figure out maxGroup size based on all occurrences selected
      // if OccurrenceType is EnrolmentCount, use only maxGroupSize
      maxGroupSize: Math.min(
        ...occurrences.map((item) => {
          switch (item.seatType) {
            case OccurrencesOccurrenceSeatTypeChoices.ChildrenCount:
              return Math.min(
                Math.min(
                  item?.maxGroupSize ?? item.amountOfSeats,
                  item.remainingSeats
                ),
                getAmountOfSeatsLeft(item)
              );
            case OccurrencesOccurrenceSeatTypeChoices.EnrolmentCount:
              return item?.maxGroupSize || 0;
            default:
              return assertUnreachable(item.seatType);
          }
        })
      ),
    }),
    [occurrences]
  );

  return (
    <EnrolmentForm
      enquiry={!autoAcceptance}
      initialValues={initialValues}
      onSubmit={submit}
      submitting={enrolmentLoading}
      onCloseForm={onCloseForm}
      minGroupSize={minGroupSize}
      maxGroupSize={maxGroupSize}
    />
  );
};

export default EnrolmentFormSection;
