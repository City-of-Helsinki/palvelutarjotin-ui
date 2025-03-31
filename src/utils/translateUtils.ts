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
  return t(
    prefix
      ? `${prefix}${
          prefix.endsWith('.') ? toCamelCase(value) : toPascalCase(value)
        }`
      : toCamelCase(value)
  );
};
