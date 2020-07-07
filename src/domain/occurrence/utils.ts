import { isFuture, isPast, subDays } from 'date-fns';

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

export const isEnrolmentOpen = (
  occurrence: OccurrenceFieldsFragment,
  event: EventFieldsFragment
): boolean => {
  return (
    event.pEvent?.enrolmentStart &&
    isPast(new Date(event.pEvent?.enrolmentStart)) &&
    event.pEvent.enrolmentEndDays !== null &&
    isFuture(
      subDays(
        new Date(occurrence.startTime),
        event.pEvent.enrolmentEndDays || 0
      )
    )
  );
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
