import { formatIntoTime } from './time/format';
import { Language } from '../types';

/**
 * Format and localize time range
 */
export default function formatTimeRange(
  start: Date,
  end: Date | null | undefined,
  locale: Language
): string {
  if (!end) {
    return formatIntoTime(start);
  } else {
    return `${formatIntoTime(start)} – ${formatIntoTime(end)}`;
  }
}
