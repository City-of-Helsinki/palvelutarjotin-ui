import { EventsQueryVariables } from '../../generated/graphql';
import { EventSearchFormValues } from './eventSearchForm/EventSearchForm';

const getTextFromDict = (
  query: NodeJS.Dict<string | string[]>,
  key: string,
  defaultValue = ''
): string | undefined => {
  if (Array.isArray(query[key])) return defaultValue;
  return (query[key] as string) || defaultValue;
};

export const getEventFilterVariables = (
  query: NodeJS.Dict<string | string[]>
): EventsQueryVariables => ({
  text: getTextFromDict(query, 'text', undefined),
});

export const getInitialValues = (
  query: NodeJS.Dict<string | string[]>
): EventSearchFormValues => {
  return {
    text: getTextFromDict(query, 'text'),
  };
};
