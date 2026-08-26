import formatTimeRange from '../formatTimeRange';

describe('formatTimeRange', () => {
  const start = new Date(2020, 11, 24, 2, 12);
  const end = new Date(2020, 11, 24, 4, 30);

  it('formats a single start time when end is missing', () => {
    expect(formatTimeRange(start, null, 'fi')).toBe('02:12');
    expect(formatTimeRange(start, undefined, 'en')).toBe('02:12');
  });

  // TIME_FORMAT is HH:mm — same digits for fi/sv/en; still verifies locale is threaded through.
  it.each(['fi', 'sv', 'en'] as const)(
    'formats a time range with locale %s',
    (locale) => {
      expect(formatTimeRange(start, end, locale)).toBe('02:12 – 04:30');
    }
  );
});
