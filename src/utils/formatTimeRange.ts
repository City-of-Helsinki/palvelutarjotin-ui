import { Language } from '../types';
import formatDate from './formatDate';

/**
 * Format and localize time range
 */
export default function formatTimeRange(
  start: Date,
  end: Date | null | undefined,
  locale: Language
): string {
  const timeFormat = 'HH:mm';

  if (!end) {
    return formatDate(start, timeFormat, locale);
  } else {
    return `${formatDate(start, timeFormat, locale)} – ${formatDate(
      end,
      timeFormat,
      locale
    )}`;
  }
}
