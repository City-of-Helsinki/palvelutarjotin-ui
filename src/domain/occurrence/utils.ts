import isNumber from 'lodash/isNumber';

import {
  EventFieldsFragment,
  OccurrenceFieldsFragment,
  OccurrencesOccurrenceSeatTypeChoices,
} from '../../generated/graphql';
import { isPast, isSameDay, subDays } from '../../utils/date-fns/exports';
import { assertUnreachable } from '../../utils/typescript.utils';

export const hasOccurrenceSpace = (
  occurrence: OccurrenceFieldsFragment
): boolean => {
  switch (occurrence.seatType) {
    case OccurrencesOccurrenceSeatTypeChoices.ChildrenCount: {
      const minGroupSize = occurrence?.minGroupSize || 0;
      return minGroupSize <= getAmountOfSeatsLeft(occurrence);
    }
    case OccurrencesOccurrenceSeatTypeChoices.EnrolmentCount:
      return occurrence.remainingSeats > 0;
    default:
      return assertUnreachable(occurrence.seatType);
  }
};

export const isMultidayOccurrence = (occurrence: {
  startTime: string;
  endTime: string;
}): boolean => {
  if (occurrence.startTime && occurrence.endTime) {
    return !isSameDay(
      new Date(occurrence.startTime),
      new Date(occurrence.endTime)
    );
  }

  return false;
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
  if (!event?.pEvent.enrolmentStart) {
    return true;
  }
  return isPast(new Date(event?.pEvent?.enrolmentStart));
};

export const isEnrolmentClosed = (
  occurrence: OccurrenceFieldsFragment,
  event?: EventFieldsFragment | null
): boolean => {
  const enrolmentEndDays = event?.pEvent?.enrolmentEndDays;
  if (isNumber(enrolmentEndDays)) {
    return isPast(subDays(new Date(occurrence.startTime), enrolmentEndDays));
  }
  return false;
};

export const isEnrolmentOpen = (
  occurrence: OccurrenceFieldsFragment,
  event?: EventFieldsFragment | null
): boolean => {
  return isEnrolmentStarted(event) && !isEnrolmentClosed(occurrence, event);
};

export const isUnenrollableOccurrence = (
  occurrence: OccurrenceFieldsFragment,
  event: EventFieldsFragment
): boolean => {
  return (
    isEnrolmentClosed(occurrence, event) ||
    !hasOccurrenceSpace(occurrence) ||
    isOccurrenceCancelled(occurrence)
  );
};
