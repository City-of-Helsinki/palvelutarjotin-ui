/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikErrors, FormikTouched } from 'formik';
import { TFunction } from 'i18next';
import get from 'lodash/get';

/** Get error text
 * @param {Object} errors
 * @param {Object} touched
 * @param {string} name
 * @param {Function} t
 * @return {string}
 */
export const getErrorText = (
  errors: FormikErrors<any>,
  touched: FormikTouched<any>,
  name: string,
  t: TFunction
): string => {
  const error: any = get(errors, name);

  if (!error || !get(touched, name)) {
    return '';
  }

  if (typeof error === 'string') {
    return t(error) as string;
  }

  return t(error.key, error) as unknown as string;
};
