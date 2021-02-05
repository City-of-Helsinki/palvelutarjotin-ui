import { isPast, subDays } from 'date-fns';

import {
  EventFieldsFragment,
  OccurrenceFieldsFragment,
  OccurrenceSeatType,
} from '../../generated/graphql';

export const hasOccurrenceSpace = (
  occurrence: OccurrenceFieldsFragment
): boolean => {
  if (occurrence.seatType === OccurrenceSeatType.ChildrenCount) {
    const minGroupSize = occurrence?.minGroupSize || 0;
    return (
      minGroupSize < occurrence.amountOfSeats - (occurrence.seatsTaken || 0)
    );
  } else if (occurrence.seatType === OccurrenceSeatType.EnrolmentCount) {
    return occurrence.remainingSeats > 0;
  }

  return false;
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
  return isPast(
    subDays(
      new Date(occurrence.startTime),
      event?.pEvent?.enrolmentEndDays || 0
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
