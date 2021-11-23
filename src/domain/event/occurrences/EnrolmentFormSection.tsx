import { omit } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-toastify';

import {
  OccurrenceFieldsFragment,
  EventFieldsFragment,
  useEnrolOccurrenceMutation,
  OccurrenceSeatType,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { saveDataForRecommendedEventsQuery } from '../../../utils/recommendedEventsUtils';
import { assertUnreachable } from '../../../utils/typescript.utils';
import { ROUTES } from '../../app/routes/constants';
import { ENROLMENT_URL_PARAMS } from '../../enrolment/constants';
import {
  EnrolmentFormFields,
  defaultInitialValues,
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
      toast(t('enrolment:errors.createFailed'), {
        type: toast.TYPE.ERROR,
      });
    }
  };

  const initialValues = React.useMemo(
    () => ({
      ...defaultInitialValues,
      language: locale.toUpperCase(),
      // some of the values used only for validation purposes
      minGroupSize: Math.max(
        ...occurrences.map((item) => item?.minGroupSize || 0)
      ),
      // figure out maxGroup size based on all occurrences selected
      // if OccurrenceType is EnrolmentCount, use only maxGroupSize
      maxGroupSize: Math.min(
        ...occurrences.map((item) => {
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
      isMandatoryAdditionalInformationRequired:
        !!isMandatoryAdditionalInformationRequired,
    }),
    [locale, isMandatoryAdditionalInformationRequired, occurrences]
  );

  return (
    <EnrolmentForm
      enquiry={!autoAcceptance}
      initialValues={initialValues}
      onSubmit={submit}
      submitting={enrolmentLoading}
      onCloseForm={onCloseForm}
    />
  );
};

export default EnrolmentFormSection;
