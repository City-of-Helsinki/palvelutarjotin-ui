import { TFunction } from 'next-i18next';

import toCamelCase from './toCamelCase';
import toPascalCase from './toPascalCase';

/**
 * Translate a single value
 */
export const translateValue = (
  prefix: string,
  value: string,
  t: TFunction
): string => {
  if (!prefix) {
    return t(toCamelCase(value));
  }

  const keySuffix = prefix.endsWith('.')
    ? toCamelCase(value)
    : toPascalCase(value);

  return t(`${prefix}${keySuffix}`);
};
