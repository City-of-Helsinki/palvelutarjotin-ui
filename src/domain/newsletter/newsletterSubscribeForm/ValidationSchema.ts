import * as Yup from 'yup';

import { VALIDATION_MESSAGE_KEYS } from '../../app/forms/constants';

export default function getValidationSchema() {
  return Yup.object().shape({
    groups: Yup.array()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
      .min(1, VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    firstName: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    lastName: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    email: Yup.string()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
      .email(VALIDATION_MESSAGE_KEYS.EMAIL),
  });
}
