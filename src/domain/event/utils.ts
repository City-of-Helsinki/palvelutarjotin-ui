import { isToday, isTomorrow } from 'date-fns';
import isBefore from 'date-fns/isBefore';
import parseISO from 'date-fns/parseISO';
import startOfDay from 'date-fns/startOfDay';
import { TFunction } from 'next-i18next';

import {
  EventFieldsFragment,
  EventQuery,
  Keyword,
  OccurrenceFieldsFragment,
} from '../../generated/graphql';
import { Language } from '../../types';
import formatDate from '../../utils/formatDate';
import getLocalisedString from '../../utils/getLocalisedString';
import getTimeFormat from '../../utils/getTimeFormat';
import { EVENT_PLACEHOLDER_IMAGES, EVENT_SOME_IMAGE } from './constants';

export const getEventPlaceholderImage = (id: string): string => {
  const numbers = id.match(/\d+/g);
  const sum = numbers
    ? numbers.reduce((prev: number, cur: string) => prev + Number(cur), 0)
    : 0;
  const index = sum % 4;

  return EVENT_PLACEHOLDER_IMAGES[index];
};

export const getEventStartTimeStr = (
  event: EventFieldsFragment,
  locale: Language,
  t: TFunction
): string | null => {
  const nextOccurrenceTime = event.pEvent.nextOccurrenceDatetime;
  const startTime = nextOccurrenceTime ? new Date(nextOccurrenceTime) : null;
  const timeFormat = getTimeFormat(locale);
  const dateFormat = 'iiii dd.MM';

  if (!startTime) return null;

  if (isToday(startTime))
    return t('event:eventCard.startTime.today', {
      time: formatDate(startTime, timeFormat, locale),
    });

  if (isTomorrow(startTime))
    return t('event:eventCard.startTime.tomorrow', {
      time: formatDate(startTime, timeFormat, locale),
    });

  return t('event:eventCard.startTime.other', {
    date: formatDate(startTime, dateFormat, locale),
    time: formatDate(startTime, timeFormat, locale),
  });
};

export const isEventFree = (event: EventFieldsFragment): boolean =>
  Boolean(event.offers.find((item) => item.isFree)?.isFree);

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
        infoUrl: getLocalisedString(event.infoUrl, locale),
        imageUrl:
          event.images?.[0]?.url || getEventPlaceholderImage(event.id || ''),
        imageAltText: event.images?.[0]?.altText,
        locationId: event.location?.id,
        photographerName: event.images?.[0]?.photographerName,
        organization: event.pEvent?.organisation?.name,
        contactPhoneNumber: event.pEvent?.contactPhoneNumber,
        contactEmail: event.pEvent?.contactEmail,
        contactPerson: event.pEvent?.contactPerson?.name,
        neededOccurrences: event.pEvent?.neededOccurrences,
        categories: event.categories,
        activities: event.additionalCriteria,
        audience: event.audience,
        isMandatoryAdditionalInformationRequired: !!event.pEvent
          ?.mandatoryAdditionalInformation,
        occurrences:
          event.pEvent?.occurrences.edges.map(
            (edge) => edge?.node as OccurrenceFieldsFragment
          ) || [],
      }
    : {};

export const getEventSomeImageUrl = (event: EventFieldsFragment): string => {
  const image = event.images.length ? event.images[0] : null;
  return image ? image.url : EVENT_SOME_IMAGE;
};

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
export const orderOccurrencesByDate = (
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

export const getRealKeywords = (
  eventData: EventQuery
): Keyword[] | undefined => {
  const { additionalCriteria, categories } = eventData.event || {};
  return eventData?.event?.keywords.filter((keyword) => {
    return !(
      categories?.find((category) => category.id === keyword.id) ||
      additionalCriteria?.find(
        (additionalCriteria) => additionalCriteria.id === keyword.id
      )
    );
  });
};
