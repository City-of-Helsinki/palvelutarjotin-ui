import * as Yup from 'yup';

import { VALIDATION_MESSAGE_KEYS } from '../../app/forms/constants';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function getValidationSchema() {
  return Yup.object().shape({
    groups: Yup.array()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
      .min(1, VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    firstName: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    lastName: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    email: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
  });
}
