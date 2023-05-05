import { EnrolmentFormFields } from './enrolmentForm/constants';
import {
  EnrolEventQueueMutationInput,
  EnrolOccurrenceMutationInput,
  Language,
  NotificationType,
} from '../../generated/graphql';

const getNotificationType = (values: EnrolmentFormFields): NotificationType => {
  return values.hasEmailNotification &&
    values.studyGroup.person.phoneNumber &&
    values.hasSmsNotification
    ? NotificationType.EmailSms
    : NotificationType.Email;
};

export const getEnrolmentPayloadBase = (
  values: EnrolmentFormFields
): Omit<EnrolOccurrenceMutationInput, 'occurrenceIds'> => {
  return {
    notificationType: getNotificationType(values),
    person: values.isSameResponsiblePerson
      ? undefined
      : { ...values.person, language: values.language as Language },
    studyGroup: {
      ...values.studyGroup,
      amountOfAdult: Number(values.studyGroup.amountOfAdult),
      groupSize: Number(values.studyGroup.groupSize),
      person: {
        ...values.studyGroup.person,
        language: values.language as Language,
      },
      studyLevels: values.studyGroup.studyLevels,
    },
  };
};

export const getEnrolmentPayload = ({
  occurrenceIds,
  values,
}: {
  occurrenceIds: string[];
  values: EnrolmentFormFields;
}): EnrolOccurrenceMutationInput => {
  return {
    occurrenceIds,
    ...getEnrolmentPayloadBase(values),
  };
};

export const getQueuePayload = ({
  pEventId,
  values,
}: {
  pEventId: string;
  values: EnrolmentFormFields;
}): EnrolEventQueueMutationInput => {
  return {
    pEventId,
    ...getEnrolmentPayloadBase(values),
  };
};

declare let grecaptcha: ReCAPTCHA;

interface ReCAPTCHA {
  ready: (f: () => void) => void;
  execute: (key: string, action: { action: string }) => Promise<string>;
}

export const getCAPTCHAToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (process.env.NEXT_PUBLIC_CAPTCHA_KEY) {
      const captchaKey = process.env.NEXT_PUBLIC_CAPTCHA_KEY;
      grecaptcha.ready(() => {
        grecaptcha
          .execute(captchaKey, { action: 'submit' })
          .then(resolve)
          .catch(reject);
      });
    } else {
      reject('CAPTCHA_KEY missing!');
    }
  });
};
