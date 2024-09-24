import { TFunction } from 'next-i18next';

import { EnrolmentStatusKeywordPropsType } from '../../../common/components/keyword/EnrolmentStatusKeyword';
import { EventsFieldsFragment } from '../../../generated/graphql';
import { Language } from '../../../types';
import { formatDateRange } from '../../../utils/time/format';
import { isMultidayOccurrence } from '../../occurrence/utils';
import { getEventStartTimeStr } from '../utils';

export const getOccurrenceDateStr = (
  occurrence: { startTime: string; endTime: string },
  locale: Language,
  t: TFunction
): string | null => {
  if (isMultidayOccurrence(occurrence)) {
    return formatDateRange(
      new Date(occurrence.startTime),
      new Date(occurrence.endTime)
    );
  }

  return getEventStartTimeStr(new Date(occurrence.startTime), locale, t);
};

/**
 * Has the event enrolments enabled in any of it's occurrences?
 * @param event The event to check the status for.
 * @returns `true` if any of the event occurrences has enrolments and
 *  `false` if none.
 */
export const hasEventEnrolmentsEnabled = (event: EventsFieldsFragment) =>
  Boolean(event.pEvent.enrolmentStart) || hasEventExternalEnrolments(event);

/**
 * Has the event external enrolments enabled in any of it's occurrences?
 *
 * @param event The event to check the status for.
 * @returns `true` if the event has some external enrolments and
 *  `false` if none of the occurrences has external enrolments.
 */
export const hasEventExternalEnrolments = (event: EventsFieldsFragment) =>
  Boolean(event.pEvent.externalEnrolmentUrl);

/**
 * Resolve the enrolment status of an event. Has the event free spots available?
 *
 * @param event The event to check the status for.
 * @returns Returns `null` if the enrolment status could not be resolved or
 *    the event has no enrolments at all,
 *    `true` if there are any free spots available and `false` if there are no
 *    spots available.
 */
export const hasEventFreeSpotsAvailable = (
  event: EventsFieldsFragment
): boolean | null => event.pEvent.hasSpaceForEnrolments ?? null;

/**
 * Determines the enrollment status of an event.
 *
 * @param event The event to check the enrollment status for.
 * @returns The enrollment status of the event, or `undefined`
 *      if no enrolments exist or the status could not be determined.
 */
export const getEventEnrolmentStatus = (
  event: EventsFieldsFragment
): EnrolmentStatusKeywordPropsType['enrolmentStatus'] => {
  if (hasEventEnrolmentsEnabled(event)) {
    if (hasEventExternalEnrolments(event)) {
      return 'externally_unknown';
    }
    const hasEventFreeSpots = hasEventFreeSpotsAvailable(event);

    if (hasEventFreeSpots === false) {
      // Event has no free spots available, so it is full.
      return 'full';
    } else if (hasEventFreeSpots === true) {
      // Event has some free spots available.
      return 'free_space_available';
    }
  }
  // No enrolments at all or the enrolment status could not be resolved
  return undefined;
};
