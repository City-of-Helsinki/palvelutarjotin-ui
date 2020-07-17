import isBefore from 'date-fns/isBefore';
import isSameDay from 'date-fns/isSameDay';
import parseISO from 'date-fns/parseISO';
import startOfDay from 'date-fns/startOfDay';
import React from 'react';

import { OccurrenceFieldsFragment } from '../../../generated/graphql';
import { isSameDayOrAfter, isSameDayOrBefore } from '../../../utils/dateUtils';

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

const getFirstOrLastDateOfOccurrences = (
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
