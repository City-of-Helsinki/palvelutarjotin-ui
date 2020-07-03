import { isToday, isTomorrow } from 'date-fns';
import { TFunction } from 'next-i18next';

import { EventFieldsFragment } from '../../generated/graphql';
import { Language } from '../../types';
import formatDate from '../../utils/formatDate';
import getLocalisedString from '../../utils/getLocalisedString';
import getTimeFormat from '../../utils/getTimeFormat';
import { EVENT_PLACEHOLDER_IMAGES } from './constants';

/**
 * Get event placeholder image url
 * @param {string} id
 * @return {string}
 */
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
  const startTime = event.startTime ? new Date(event.startTime) : null;
  const timeFormat = getTimeFormat(locale);

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
    date: formatDate(startTime),
    time: formatDate(startTime, timeFormat, locale),
  });
};

/**
 * Check is event free
 * @param eventData
 * @return {boolean}
 */
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
        eventName: getLocalisedString(event?.name, locale),
        shortDescription: getLocalisedString(event?.shortDescription, locale),
        description: getLocalisedString(event?.description, locale),
        imageUrl: event?.images?.[0]?.url,
        imageAltText: event?.images?.[0]?.altText,
        photographerName: event?.images?.[0]?.photographerName,
        organization: event.pEvent?.organisation?.name,
        contactPhoneNumber: event.pEvent?.contactPhoneNumber,
        contactEmail: event.pEvent?.contactEmail,
        contactPerson: event.pEvent?.contactPerson?.name,
      }
    : {};
