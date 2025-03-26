import { isSameDay } from 'date-fns';
import React from 'react';

import { OccurrenceFieldsFragment } from '../../../generated/graphql';
import { isSameDayOrAfter, isSameDayOrBefore } from '../../../utils/dateUtils';
import { DateFilterProps } from '../dateFilter/DateFilter';
import { getFirstOrLastDateOfOccurrences } from '../utils';

type UseDateFilteringProps = DateFilterProps & {
  filteredOccurrences: OccurrenceFieldsFragment[];
};

export const useDateFiltering = ({
  occurrences,
}: {
  occurrences: OccurrenceFieldsFragment[];
}): UseDateFilteringProps => {
  const [initialStartDate, initialEndDate] = React.useMemo(
    () => [
      getFirstOrLastDateOfOccurrences(occurrences, 'first'),
      getFirstOrLastDateOfOccurrences(occurrences, 'last'),
    ],
    [occurrences]
  );

  const [startDate, setStartDate] = React.useState(initialStartDate);
  const [endDate, setEndDate] = React.useState(initialEndDate);

  const isInitialStartDate = isSameDay(initialStartDate, startDate);
  const isInitialEndDate = isSameDay(initialEndDate, endDate);
  const dateFiltersChanged = !(isInitialStartDate && isInitialEndDate);

  React.useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  const filteredOccurrences = occurrences.filter((occurrence) => {
    return (
      isSameDayOrAfter(new Date(occurrence.startTime), startDate) &&
      isSameDayOrBefore(new Date(occurrence.startTime), endDate)
    );
  });

  const setStartFilterDate = (date?: Date | null) => {
    if (date) {
      setStartDate(date);
    }
  };

  const setEndFilterDate = (date?: Date | null) => {
    if (date) {
      setEndDate(date);
    }
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
