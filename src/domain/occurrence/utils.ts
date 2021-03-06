import { isPast, subDays } from 'date-fns';

import {
  EventFieldsFragment,
  OccurrenceFieldsFragment,
  OccurrenceSeatType,
} from '../../generated/graphql';
import assertUnreachable from '../../utils/assertUnreachable';

export const hasOccurrenceSpace = (
  occurrence: OccurrenceFieldsFragment
): boolean => {
  switch (occurrence.seatType) {
    case OccurrenceSeatType.ChildrenCount:
      const minGroupSize = occurrence?.minGroupSize || 0;
      return minGroupSize <= getAmountOfSeatsLeft(occurrence);
    case OccurrenceSeatType.EnrolmentCount:
      return occurrence.remainingSeats > 0;
    default:
      assertUnreachable(occurrence.seatType);
  }
};

export const isOccurrenceCancelled = (
  occurrence: OccurrenceFieldsFragment
): boolean => occurrence.cancelled;

export const getAmountOfSeatsLeft = (
  occurrence: OccurrenceFieldsFragment
): number => {
  const amountOfSeatsLeft =
    occurrence.amountOfSeats - (occurrence.seatsTaken || 0);

  // Don't return negative space left, but a 0 instead
  return Math.max(0, amountOfSeatsLeft);
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
