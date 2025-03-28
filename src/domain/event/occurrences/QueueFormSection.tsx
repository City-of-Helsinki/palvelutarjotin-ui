import { omit } from 'lodash';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { toast } from 'react-toastify';

import { TOAST_AUTO_CLOSE_DURATION_MS } from '../../../constants';
import {
  EventFieldsFragment,
  useEnrolEventQueueMutation,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { ROUTES } from '../../app/routes/constants';
import { ENROLMENT_URL_PARAMS } from '../../enrolment/constants';
import {
  EnrolmentFormFields,
  defaultEnrolmentInitialValues,
} from '../../enrolment/enrolmentForm/constants';
import EnrolmentForm from '../../enrolment/enrolmentForm/EnrolmentForm';
import { getCAPTCHAToken, getQueuePayload } from '../../enrolment/utils';
import { getEventFields } from '../utils';

const QueueFormSection: React.FC<{
  event: EventFieldsFragment;
  onCloseForm: () => void;
  onQueue?: () => void;
}> = ({ event, onCloseForm, onQueue }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const router = useRouter();

  const [enrolQueue, { loading: queueLoading }] = useEnrolEventQueueMutation();

  const { isMandatoryAdditionalInformationRequired, autoAcceptance } =
    getEventFields(event, locale);

  const submit = async (values: EnrolmentFormFields) => {
    try {
      const token = await getCAPTCHAToken();
      await enrolQueue({
        variables: {
          input: {
            ...getQueuePayload({
              pEventId: event.pEvent.id,
              values,
            }),
            captchaKey: token,
          },
        },
      });
      router.push({
        pathname: ROUTES.EVENT_DETAILS.replace(':id', event.id as string),
        query: {
          ...omit(router.query, [
            ENROLMENT_URL_PARAMS.EVENT_ID,
            ENROLMENT_URL_PARAMS.OCCURRENCES,
          ]),
          [ENROLMENT_URL_PARAMS.QUEUE_CREATED]: true,
        },
      });
      onQueue?.();
    } catch {
      toast(t('enrolment:queue.error'), {
        type: 'error',
        autoClose: TOAST_AUTO_CLOSE_DURATION_MS,
      });
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

  return (
    <EnrolmentForm
      actionType="queue"
      enquiry={!autoAcceptance}
      initialValues={initialValues}
      onSubmit={submit}
      submitting={queueLoading}
      onCloseForm={onCloseForm}
    />
  );
};

export default QueueFormSection;
