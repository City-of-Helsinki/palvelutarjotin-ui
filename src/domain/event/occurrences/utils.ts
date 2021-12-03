import {
  EventFieldsFragment,
  OccurrenceFieldsFragment,
} from '../../../generated/graphql';
import { ENROLMENT_ERRORS } from '../../enrolment/constants';
import {
  hasOccurrenceSpace,
  isEnrolmentClosed,
  isOccurrenceCancelled,
} from '../../occurrence/utils';

export function getEnrolmentError(
  occurrence: OccurrenceFieldsFragment,
  event: EventFieldsFragment
): ENROLMENT_ERRORS | null {
  if (isEnrolmentClosed(occurrence, event))
    return ENROLMENT_ERRORS.ENROLMENT_CLOSED_ERROR;
  if (!hasOccurrenceSpace(occurrence))
    return ENROLMENT_ERRORS.NOT_ENOUGH_CAPACITY_ERROR;
  if (isOccurrenceCancelled(occurrence)) {
    return ENROLMENT_ERRORS.ENROLMENT_CANCDELLED_ERROR;
  }

  return null;
}
