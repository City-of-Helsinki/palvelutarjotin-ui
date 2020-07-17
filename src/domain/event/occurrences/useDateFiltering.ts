import isSameDay from 'date-fns/isSameDay';
import React from 'react';

import { OccurrenceFieldsFragment } from '../../../generated/graphql';
import { isSameDayOrAfter, isSameDayOrBefore } from '../../../utils/dateUtils';
import { getFirstOrLastDateOfOccurrences } from '../utils';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useDateFiltering = ({
  occurrences,
}: {
  occurrences: OccurrenceFieldsFragment[];
}) => {
  const initialStartDate = React.useMemo(
    () => getFirstOrLastDateOfOccurrences(occurrences, 'first'),
    [occurrences]
  );
  const initialEndDate = React.useMemo(
    () => getFirstOrLastDateOfOccurrences(occurrences, 'last'),
    [occurrences]
  );
  const [startDate, setStartDate] = React.useState(initialStartDate);
  const [endDate, setEndDate] = React.useState(initialEndDate);

  const isInitialStartDate = isSameDay(initialStartDate, startDate);
  const isInitialEndDate = isSameDay(initialEndDate, endDate);
  const dateFiltersChanged = !(isInitialStartDate && isInitialEndDate);

  const filteredOccurrences = occurrences.filter((occurrence) => {
    return (
      isSameDayOrAfter(new Date(occurrence.startTime), startDate) &&
      isSameDayOrBefore(new Date(occurrence.startTime), endDate)
    );
  });

  const setStartFilterDate = (date?: Date | null) => {
    date && setStartDate(date);
  };

  const setEndFilterDate = (date?: Date | null) => {
    date && setEndDate(date);
  };

  const setInitialDateFilters = () => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  };

  return {
    startDate,
    endDate,
    setStartFilterDate,
    setEndFilterDate,
    setInitialDateFilters,
    filteredOccurrences,
    isInitialStartDate,
    isInitialEndDate,
    dateFiltersChanged,
  };
};
