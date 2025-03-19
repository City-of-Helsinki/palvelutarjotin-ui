import type { Language } from '../types';
import { formatIntoTime } from './time/format';

/**
 * Format and localize time range
 */
export default function formatTimeRange(
  start: Date,
  end: Date | null | undefined,
  // FIXME: Add support for localization, now it's always in Finnish
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  locale: Language
): string {
  if (!end) {
    return formatIntoTime(start);
  } else {
    return `${formatIntoTime(start)} – ${formatIntoTime(end)}`;
  }
}
