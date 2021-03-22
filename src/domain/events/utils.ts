import isValidDate from 'date-fns/isValid';

import { EVENT_LANGUAGES } from '../../constants';
import {
  EventsQueryVariables,
  EventsFieldsFragment,
  EventsQuery,
} from '../../generated/graphql';
import deleteEmptyPropertiesFromObject from '../../utils/deleteEmptyPropertiesFromObject';
import { queryParameterToArray } from '../../utils/queryParameterToArray';
import { EventSearchFormValues } from './eventSearchForm/EventSearchForm';

export const getSearchQueryObject = (
  values: EventSearchFormValues
): Record<string, string | string[]> => {
  return deleteEmptyPropertiesFromObject({
    ...values,
    date: values.date?.toISOString(),
    endDate: values.endDate?.toISOString(),
  });
};

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
  include: ['keywords', 'location'],
  text: getTextFromDict(query, 'text', undefined),
  inLanguage: getTextFromDict(query, 'inLanguage', undefined),
  keyword: getKeywordsToQuery(query),
  start: getDateString(query.date) || 'now',
  end: getDateString(query.endDate),
  location: getTextFromDict(query, 'places', undefined),
  ...options,
});

const getKeywordsToQuery = ({
  categories,
  targetGroups,
  additionalCriteria,
}: {
  categories?: string | string[];
  targetGroups?: string | string[];
  additionalCriteria?: string | string[];
}): string[] => {
  return [categories, targetGroups, additionalCriteria].reduce<string[]>(
    (prev, next) => {
      return [...prev, ...(Array.isArray(next) ? next : next ? [next] : [])];
    },
    []
  );
};

export const getDateString = (date?: string | string[]): string | null => {
  return typeof date === 'string' && isValidDate(new Date(date))
    ? new Date(date).toISOString()
    : null;
};

export const getInitialValues = (
  query: NodeJS.Dict<string | string[]>
): EventSearchFormValues => {
  return {
    text: getTextFromDict(query, 'text') || '',
    date: getInitialDate(query.date),
    endDate: getInitialDate(query.endDate),
    inLanguage: queryParameterToArray(query.inLanguage as EVENT_LANGUAGES),
    places: queryParameterToArray(query.places),
    targetGroups: queryParameterToArray(query.targetGroups),
    categories: queryParameterToArray(query.categories),
    additionalCriteria: queryParameterToArray(query.additionalCriteria),
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
): EventsFieldsFragment[] | undefined => {
  return eventData?.events?.data.filter((e) => e.pEvent.nextOccurrenceDatetime);
};
