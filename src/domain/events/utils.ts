import { isValid as isValidDate } from 'date-fns';

import { KEYWORD_QUERY_PARAMS } from './constants';
import { EventSearchFormValues } from './eventSearchForm/EventSearchForm';
import { EVENT_LANGUAGES } from '../../constants';
import {
  EventsQueryVariables,
  EventsFieldsFragment,
  EventsQuery,
} from '../../generated/graphql';
import deleteEmptyPropertiesFromObject from '../../utils/deleteEmptyPropertiesFromObject';
import { queryParameterToArray } from '../../utils/queryParameterToArray';

export const getSearchQueryObject = (
  values: EventSearchFormValues
): Record<string, string | string[]> => {
  return deleteEmptyPropertiesFromObject({
    ...values,
    date: values.date?.toISOString(),
    endDate: values.endDate?.toISOString(),
    isFree: values.isFree ? 'true' : undefined,
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
): EventsQueryVariables => {
  const search = getTextFromDict(query, 'text', undefined);
  return {
    include: ['keywords', 'location', 'audience', 'in_language'],
    text: search ?? '',
    inLanguage: getTextFromDict(query, 'inLanguage', undefined),
    start: getDateString(query.date) || 'now',
    end: getDateString(query.endDate),
    location: getTextFromDict(query, 'places', undefined),
    organisationId: getTextFromDict(query, 'organisation', undefined),
    division: getTextFromDict(query, 'divisions', undefined),
    isFree: query.isFree === 'true' ? true : undefined,
    ...getKeywordsToQuery(query),
    ...options,
  };
};

type KeywordOrSetSearchVariablesType = {
  keywordOrSet1?: string[];
  keywordOrSet2?: string[];
  keywordOrSet3?: string[];
};

const toArray = (
  value: string | string[] | null | undefined
): string[] | undefined =>
  Array.isArray(value) ? value : value ? [value] : undefined;

const getKeywordsToQuery = (keywords: {
  [KEYWORD_QUERY_PARAMS.CATEGORIES]?: string | string[];
  [KEYWORD_QUERY_PARAMS.TARGET_GROUPS]?: string | string[];
  [KEYWORD_QUERY_PARAMS.ADDITIONAL_CRITERIA]?: string | string[];
}): KeywordOrSetSearchVariablesType => ({
  keywordOrSet1: toArray(keywords[KEYWORD_QUERY_PARAMS.CATEGORIES]),
  keywordOrSet2: toArray(keywords[KEYWORD_QUERY_PARAMS.TARGET_GROUPS]),
  keywordOrSet3: toArray(keywords[KEYWORD_QUERY_PARAMS.ADDITIONAL_CRITERIA]),
});

const getDateString = (date?: string | string[]): string | null => {
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
    divisions: queryParameterToArray(query.divisions),
    isFree: query.isFree === 'true',
    [KEYWORD_QUERY_PARAMS.TARGET_GROUPS]: queryParameterToArray(
      query[KEYWORD_QUERY_PARAMS.TARGET_GROUPS]
    ),
    [KEYWORD_QUERY_PARAMS.CATEGORIES]: queryParameterToArray(
      query[KEYWORD_QUERY_PARAMS.CATEGORIES]
    ),
    [KEYWORD_QUERY_PARAMS.ADDITIONAL_CRITERIA]: queryParameterToArray(
      query[KEYWORD_QUERY_PARAMS.ADDITIONAL_CRITERIA]
    ),
  };
};

const getInitialDate = (date?: string | string[]): Date | null => {
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
