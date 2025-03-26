import { act, renderHook } from '@testing-library/react-hooks';
import { format } from 'date-fns';

import { fakeOccurrence } from '../../../../utils/mockDataUtils';
import { useDateFiltering } from '../useDateFiltering';

const occurrences = [
  fakeOccurrence({
    startTime: '2020-07-14T09:00:00+00:00',
  }),
  fakeOccurrence({
    startTime: '2020-07-15T09:00:00+00:00',
  }),
  fakeOccurrence({
    startTime: '2020-07-16T09:00:00+00:00',
  }),
  fakeOccurrence({
    startTime: '2020-07-20T09:00:00+00:00',
  }),
  fakeOccurrence({
    startTime: '2020-07-21T09:00:00+00:00',
  }),
  fakeOccurrence({
    startTime: '2020-07-22T09:00:00+00:00',
  }),
  fakeOccurrence({
    startTime: '2020-07-23T09:00:00+00:00',
  }),
  fakeOccurrence({
    startTime: '2020-07-27T09:00:00+00:00',
  }),
  fakeOccurrence({
    startTime: '2020-07-28T09:00:00+00:00',
  }),
  fakeOccurrence({
    startTime: '2020-07-29T09:00:00+00:00',
  }),
  fakeOccurrence({
    startTime: '2020-07-30T09:30:00+00:00',
  }),
  fakeOccurrence({
    startTime: '2020-07-31T09:00:00+00:00',
  }),
];

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
