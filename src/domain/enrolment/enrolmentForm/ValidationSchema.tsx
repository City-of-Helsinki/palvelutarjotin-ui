import * as Yup from 'yup';

import { VALIDATION_MESSAGE_KEYS } from '../../app/forms/constants';

export default Yup.object().shape({
  language: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
  studyGroup: Yup.object().shape({
    person: Yup.object().shape({
      name: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
      phoneNumber: Yup.string().required(
        VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
      ),
      emailAddress: Yup.string()
        .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
        .email(VALIDATION_MESSAGE_KEYS.EMAIL),
    }),
    name: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    groupName: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    groupSize: Yup.number()
      .required(VALIDATION_MESSAGE_KEYS.NUMBER_REQUIRED)
      .min(0, (param) => ({
        min: param.min,
        key: VALIDATION_MESSAGE_KEYS.NUMBER_MIN,
      })),
    amountOfAdult: Yup.number()
      .required(VALIDATION_MESSAGE_KEYS.NUMBER_REQUIRED)
      .min(0, (param) => ({
        min: param.min,
        key: VALIDATION_MESSAGE_KEYS.NUMBER_MIN,
      })),
    studyLevel: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
  }),
});
