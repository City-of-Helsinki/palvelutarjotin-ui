import { isPast, subDays, addDays } from 'date-fns';

import {
  EventFieldsFragment,
  OccurrenceFieldsFragment,
} from '../../generated/graphql';

export const hasOccurrenceSpace = (
  occurrence: OccurrenceFieldsFragment
): boolean => {
  return (
    occurrence.minGroupSize <
    occurrence.amountOfSeats - (occurrence.seatsTaken || 0)
  );
};

export const isEnrolmentStarted = (
  event?: EventFieldsFragment | null
): boolean => {
  return (
    event?.pEvent?.enrolmentStart &&
    isPast(new Date(event?.pEvent?.enrolmentStart))
  );
};

export const isEnrolmentClosed = (
  occurrence: OccurrenceFieldsFragment,
  event?: EventFieldsFragment | null
): boolean => {
  return (
    event?.pEvent?.enrolmentEndDays === null ||
    isPast(
      addDays(
        new Date(occurrence.startTime),
        event?.pEvent?.enrolmentEndDays || 0
      )
    )
  );
};

export const isEnrolmentOpen = (
  occurrence: OccurrenceFieldsFragment,
  event?: EventFieldsFragment | null
): boolean => {
  return isEnrolmentStarted(event) && !isEnrolmentClosed(occurrence, event);
};

export const isEnrolmentAvailable = (
  occurrence: OccurrenceFieldsFragment,
  event?: EventFieldsFragment | null
): boolean => {
  return (
    !!event &&
    hasOccurrenceSpace(occurrence) &&
    isEnrolmentOpen(occurrence, event)
  );
};
