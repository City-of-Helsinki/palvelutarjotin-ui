import {
  EventsQueryVariables,
  EventFieldsFragment,
  EventsQuery,
} from '../../generated/graphql';
import { EventSearchFormValues } from './eventSearchForm/EventSearchForm';

export const getTextFromDict = (
  query: NodeJS.Dict<string | string[]>,
  key: string,
  defaultValue = ''
): string | undefined => {
  if (Array.isArray(query[key])) return defaultValue;
  return (query[key] as string) || defaultValue;
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
  ...options,
});

export const getInitialValues = (
  query: NodeJS.Dict<string | string[]>
): EventSearchFormValues => {
  return {
    text: getTextFromDict(query, 'text') || '',
  };
};

export const getEventsThatHaveUpcomingOccurrence = (
  eventData?: EventsQuery
): EventFieldsFragment[] | undefined => {
  return eventData?.events?.data.filter((e) => e.pEvent.nextOccurrenceDatetime);
};
