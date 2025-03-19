import { Language } from '../../types';
import {
  format as formatDateStr,
  enGB as en,
  fi,
  sv,
} from '../../utils/date-fns/exports';

const locales = { en, fi, sv };

// Check recommended formats: https://hds.hel.fi/guidelines/data-formats

export const DATE_FORMAT = 'd.M.yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

export function formatIntoTime(date: Date): string {
  return formatDateStr(date, TIME_FORMAT);
}

export function formatIntoDateTime(date: Date): string {
  return formatDateStr(date, DATETIME_FORMAT);
}

export function formatIntoDate(date: Date): string {
  return formatDateStr(date, DATE_FORMAT);
}

export function formatDateRange(start: Date, end: Date): string {
  return `${formatIntoDate(start)} – ${formatIntoDate(end)}`;
}

export function formatLocalizedDate(
  date: Date | null,
  format = DATE_FORMAT,
  locale: Language = 'fi'
): string {
  if (!date) {
    return '';
  }

  return formatDateStr(date, format, {
    locale: locales[locale],
  });
}
