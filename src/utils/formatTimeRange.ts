import { Language } from '../types';
import { formatIntoTime } from './time/format';

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
