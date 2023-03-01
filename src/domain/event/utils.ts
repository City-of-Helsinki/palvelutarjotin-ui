import isBefore from 'date-fns/isBefore';
import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import parseISO from 'date-fns/parseISO';
import startOfDay from 'date-fns/startOfDay';
import { TFunction } from 'next-i18next';

import {
  EnrolmentType,
  EVENT_PLACEHOLDER_IMAGES,
  EVENT_SOME_IMAGE,
} from './constants';
import {
  EventFieldsFragment,
  EventQuery,
  Keyword,
  EventsFieldsFragment,
  OccurrenceFieldsFragment,
  PEventFieldsFragment,
} from '../../generated/graphql';
import { Language } from '../../types';
import getLocalisedString from '../../utils/getLocalisedString';
import { formatIntoTime, formatLocalizedDate } from '../../utils/time/format';

export const getEventPlaceholderImage = (id: string): string => {
  const numbers = id.match(/\d+/g);
  const sum = numbers
    ? numbers.reduce((prev: number, cur: string) => prev + Number(cur), 0)
    : 0;
  const index = sum % 4;

  return EVENT_PLACEHOLDER_IMAGES[index];
};

export const getEventStartTimeStr = (
  startTime: Date,
  locale: Language,
  t: TFunction
): string | null => {
  if (!startTime) return null;
  const dateFormat = 'iiii d.M.';

  if (isToday(startTime))
    return t('event:eventCard.startTime.today', {
      time: formatIntoTime(startTime),
    });

  if (isTomorrow(startTime))
    return t('event:eventCard.startTime.tomorrow', {
      time: formatIntoTime(startTime),
    });

  return t('event:eventCard.startTime.other', {
    date: formatLocalizedDate(startTime, dateFormat, locale),
    time: formatIntoTime(startTime),
  });
};

export const isEventFree = (
  event: EventFieldsFragment | EventsFieldsFragment
): boolean => Boolean(event.offers.find((item) => item.isFree)?.isFree);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getEventFields = (
  event: EventFieldsFragment | undefined | null,
  locale: Language
) =>
  event
    ? {
        isEventFree: isEventFree(event),
        eventName: getLocalisedString(event.name, locale),
        shortDescription: getLocalisedString(event.shortDescription, locale),
        description: getLocalisedString(event.description, locale),
        keywords: [...event.keywords, ...event.audience],
        infoUrl: getLocalisedString(event.infoUrl, locale),
        imageUrl:
          event.images?.[0]?.url || getEventPlaceholderImage(event.id || ''),
        imageAltText: event.images?.[0]?.altText,
        locationId: event.location?.id,
        photographerName: event.images?.[0]?.photographerName,
        organisation: event.pEvent?.organisation?.name,
        organisationId: event.pEvent?.organisation?.id,
        contactPhoneNumber: event.pEvent?.contactPhoneNumber,
        contactEmail: event.pEvent?.contactEmail,
        contactPerson: event.pEvent?.contactPerson?.name,
        neededOccurrences: event.pEvent?.neededOccurrences,
        categories: event.categories,
        activities: event.additionalCriteria,
        audience: event.audience,
        languages: event.inLanguage,
        autoAcceptance: event.pEvent?.autoAcceptance,
        isMandatoryAdditionalInformationRequired:
          !!event.pEvent?.mandatoryAdditionalInformation,
        occurrences:
          event.pEvent?.occurrences?.edges.map(
            (edge) => edge?.node as OccurrenceFieldsFragment
          ) || [],
      }
    : {};

export const getEventSomeImageUrl = (event: EventFieldsFragment): string => {
  const image = event.images.length ? event.images[0] : null;
  return image ? image.url : EVENT_SOME_IMAGE;
};

/* NOTE: occurrences could be an empty list, 
and then we would get index out of bound error. 
However, TypeScript makes it hard or impossible 
at the moment to return undefined from here, 
because callers are waiting for a Date 
and hooks don't allow early returns */
export const getFirstOrLastDateOfOccurrences = (
  occurrences: OccurrenceFieldsFragment[],
  option: 'first' | 'last'
): Date => {
  const orderedOccurrences = occurrences.sort(orderOccurrencesByDate);

  let date: Date;

  if (option === 'first') {
    date = new Date(orderedOccurrences[0].startTime);
  } else {
    date = new Date(
      orderedOccurrences[orderedOccurrences.length - 1].startTime
    );
  }

  return startOfDay(date);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const orderOccurrencesByDate = (
  a: OccurrenceFieldsFragment,
  b: OccurrenceFieldsFragment
) => {
  const aParsedStartTime = parseISO(a.startTime);
  const bParsedStartTime = parseISO(b.startTime);
  if (isBefore(aParsedStartTime, bParsedStartTime)) {
    return -1;
  }
  if (isBefore(bParsedStartTime, aParsedStartTime)) {
    return 1;
  }
  return 0;
};

// Get keywords that are not already included in additionalCriteria or categories.
export const getRealKeywords = (
  eventData: EventQuery
): Keyword[] | undefined => {
  const { additionalCriteria, categories } = eventData.event || {};

  // Combine other keywords into a single array to make filtering simpler
  const otherKeywords = [...(additionalCriteria ?? []), ...(categories ?? [])];

  return eventData?.event?.keywords.filter(
    (keyword) => !otherKeywords?.find((category) => category.id === keyword.id)
  );
};

export const getEnrolmentType = (
  event: PEventFieldsFragment
): EnrolmentType => {
  if (event.externalEnrolmentUrl) {
    return EnrolmentType.External;
  }
  if (event.enrolmentStart) {
    return EnrolmentType.Internal;
  }
  return EnrolmentType.Unenrollable;
};
