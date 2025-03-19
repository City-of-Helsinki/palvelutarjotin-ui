import get from 'lodash/get';

import {
  isAfter,
  isBefore,
  isSameDay,
  isValid,
  enGB as en,
  fi,
  parse,
  format as formatDateStr,
} from './date-fns/exports';
import sv from './date-fns/locale/sv';
import { DATE_FORMAT } from './time/format';

const locales = { en, fi, sv };
/**
 * Format date string
 * @param date
 * @param format
 * @returns {string}
 */
export const formatDate = (
  date: Date | null | number,
  format = DATE_FORMAT,
  locale = 'fi'
): string => {
  if (!date) {
    return '';
  }

  return formatDateStr(date, format, {
    locale: get(locales, locale),
  }).trim();
};

/**
 * Test is date valid
 * @param date
 * @returns {boolean}
 */
const isValidDate = (date: Date): boolean =>
  isValid(date) && isAfter(date, new Date('1000-01-01'));

/**
 * Test is entered string a date string in Finnish format without dots (e.g. 31122019)
 * @param str
 * @returns {boolean}
 */
const isShortDateStr = (str: string) =>
  str.length === 8 && /^[0-9.]+$/.test(str);

/**
 * Convert date string without dots to Finnish date string format (e.g. 31.12.2019)
 * @param str
 * @returns {object}
 */
const getShortDateStr = (str: string): string =>
  [str.substring(0, 2), str.substring(2, 4), str.substring(4, 9)].join('.');

/**
 * Get date object from valid Finnish date string
 * @param value
 * @returns {object}
 */
const getParsedDate = (value: string): Date =>
  parse(value, DATE_FORMAT, new Date(), { locale: fi });

/**
 * Convert string in Finnish date format (e.g. 31.12.2019) or in format without dots (e.g. 31122019) to Date object
 * @returns {object}
 * @param str
 */
export const convertFinnishDateStrToDate = (str: string): Date | null => {
  let parsedDate = getParsedDate(str);

  if (isValidDate(parsedDate)) {
    return parsedDate;
  } else if (isShortDateStr(str)) {
    const dateStr = getShortDateStr(str);

    parsedDate = getParsedDate(dateStr);

    if (isValidDate(parsedDate)) {
      return parsedDate;
    }
  }
  return null;
};

export const isSameDayOrAfter = (date: Date, compareDate: Date): boolean => {
  return isSameDay(date, compareDate) || isAfter(date, compareDate);
};

export const isSameDayOrBefore = (date: Date, compareDate: Date): boolean => {
  return isSameDay(date, compareDate) || isBefore(date, compareDate);
};
