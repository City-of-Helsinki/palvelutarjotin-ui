import { fireEvent } from '@testing-library/react';
import format from 'date-fns/format';
import { act, renderHook } from '@testing-library/react-hooks';

import occurrences from '../__mocks__/occurrences';
import { useDateFiltering } from '../useDateFiltering';

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

it('calculates first and last date correctly', () => {
  const { result } = renderHook(() => useDateFiltering({ occurrences }));

  expect(formatDate(result.current.startDate)).toBe('2020-07-14');
  expect(formatDate(result.current.endDate)).toBe('2020-07-31');

  expect(result.current.isInitialStartDate).toBe(true);
  expect(result.current.isInitialEndDate).toBe(true);
  expect(result.current.dateFiltersChanged).toBe(false);
});

it('sets start and end filter date correctly and filters occurrences correctly', () => {
  const { result } = renderHook(() => useDateFiltering({ occurrences }));

  expect(result.current.filteredOccurrences).toHaveLength(12);
  expect(result.current.dateFiltersChanged).toBe(false);

  act(() => {
    result.current.setStartFilterDate(new Date(2020, 6, 16));
  });

  expect(formatDate(result.current.startDate)).toBe('2020-07-16');
  expect(result.current.isInitialStartDate).toBe(false);

  act(() => {
    result.current.setEndFilterDate(new Date(2020, 6, 20));
  });

  expect(formatDate(result.current.endDate)).toBe('2020-07-20');
  expect(result.current.isInitialEndDate).toBe(false);

  expect(result.current.filteredOccurrences).toHaveLength(2);
  expect(result.current.dateFiltersChanged).toBe(true);

  act(() => {
    result.current.setInitialDateFilters();
  });
  expect(result.current.filteredOccurrences).toHaveLength(12);
});

it('sets initial dates back correctly', () => {
  const { result } = renderHook(() => useDateFiltering({ occurrences }));

  act(() => {
    result.current.setStartFilterDate(new Date(2020, 6, 16));
  });
  expect(formatDate(result.current.startDate)).toBe('2020-07-16');

  act(() => {
    result.current.setInitialDateFilters();
  });
  expect(formatDate(result.current.startDate)).toBe('2020-07-14');

  act(() => {
    result.current.setEndFilterDate(new Date(2020, 7, 5));
  });
  expect(formatDate(result.current.endDate)).toBe('2020-08-05');

  act(() => {
    result.current.setInitialDateFilters();
  });
  expect(formatDate(result.current.endDate)).toBe('2020-07-31');
});
