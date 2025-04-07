import { TZDate } from '@date-fns/tz';
import { isAfter, isBefore, isSameDay, format } from 'date-fns';
import { enGB as en, fi } from 'date-fns/locale';
import get from 'lodash/get';

import { DATE_FORMAT, TIMEZONE } from '../constants';
import sv from './date-fns/locale/sv';

export const locales = { en, fi, sv };

/**
 * Format date string
 * @param date
 * @param format
 * @returns {string}
 */
export const formatDate = (
  date: Date | null | number,
  dateFormat = DATE_FORMAT,
  locale = 'fi'
): string => {
  if (!date) {
    return '';
  }

  return format(new TZDate(new Date(date), TIMEZONE), dateFormat, {
    locale: get(locales, locale),
  }).trim();
};

export const isSameDayOrAfter = (date: Date, compareDate: Date): boolean => {
  return isSameDay(date, compareDate) || isAfter(date, compareDate);
};

export const isSameDayOrBefore = (date: Date, compareDate: Date): boolean => {
  return isSameDay(date, compareDate) || isBefore(date, compareDate);
};
