import isValidDate from 'date-fns/isValid';

import { EVENT_LANGUAGES } from '../../constants';
import {
  EventsQueryVariables,
  EventFieldsFragment,
  EventsQuery,
} from '../../generated/graphql';
import { queryParameterToArray } from '../../utils/queryParameterToArray';
import { EventSearchFormValues } from './eventSearchForm/EventSearchForm';

export const getTextFromDict = (
  query: NodeJS.Dict<string | string[]>,
  key: string,
  defaultValue = ''
): string | undefined => {
  const value = query[key];
  if (Array.isArray(value)) return value.join(',');
  return (value as string) || defaultValue;
};

type EventFilterOptions = {
  page?: number;
  pageSize?: number;
};

export const getEventFilterVariables = (
  query: NodeJS.Dict<string | string[]>,
  options?: EventFilterOptions
): EventsQueryVariables => ({
  include: ['keywords,location'],
  text: getTextFromDict(query, 'text', undefined),
  inLanguage: getTextFromDict(query, 'inLanguage', undefined),
  start:
    typeof query.date === 'string' && isValidDate(new Date(query.date))
      ? new Date(query.date).toISOString()
      : null,
  ...options,
});

export const getInitialValues = (
  query: NodeJS.Dict<string | string[]>
): EventSearchFormValues => {
  return {
    text: getTextFromDict(query, 'text') || '',
    date: getInitialDate(query.date),
    inLanguage: queryParameterToArray(query.inLanguage as EVENT_LANGUAGES),
  };
};

export const getInitialDate = (date?: string | string[]): Date | null => {
  if (typeof date === 'string' && isValidDate(new Date(date))) {
    return new Date(date);
  }

  return null;
};

export const getEventsThatHaveUpcomingOccurrence = (
  eventData?: EventsQuery
): EventFieldsFragment[] | undefined => {
  return eventData?.events?.data.filter((e) => e.pEvent.nextOccurrenceDatetime);
};
