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

export function getOrderedLanguages(
  languages: { id: string; name: string }[]
): string[] {
  const languageOrder = ['fi', 'sv', 'en'];
  const languageStrings = languages.map((l) => l.id.split('_')[0]);

  // order languages based on languageOrder, other languages go
  // to the end of the array
  return languageStrings.sort((a, b) => {
    const aIndex = languageOrder.indexOf(a);
    const bIndex = languageOrder.indexOf(b);

    if (aIndex > -1 && bIndex > -1) {
      return aIndex - bIndex;
    }

    if (aIndex > -1 && bIndex === -1) {
      return -1;
    }

    if (bIndex > -1 && aIndex === -1) {
      return 1;
    }

    return 0;
  });
}
