/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikErrors, FormikTouched } from 'formik';
import { TFunction } from 'i18next';

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
  const error: any = errors[name];

  return !!error && touched[name]
    ? typeof error === 'string'
      ? t(error)
      : t(error.key, error)
    : '';
};
