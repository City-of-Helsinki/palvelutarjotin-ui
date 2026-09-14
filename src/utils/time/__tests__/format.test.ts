import { formatIntoDate, formatIntoDateTime, formatIntoTime } from '../format';

describe('format', () => {
  describe('formatIntoDateTime', () => {
    it('returns correctly formatted datetime', () => {
      const date = new Date(2020, 11, 24, 2, 12);

      expect(formatIntoDateTime(date)).toMatchInlineSnapshot(
        `"24.12.2020 02:12"`
      );
    });
  });

  describe('formatIntoTime', () => {
    it('returns correctly formatted date', () => {
      const date = new Date(2020, 11, 24, 2, 12);

      expect(formatIntoDate(date)).toMatchInlineSnapshot(`"24.12.2020"`);
    });

    // TIME_FORMAT is HH:mm — same digits for fi/sv/en; still verifies each locale is accepted.
    it.each(['fi', 'sv', 'en'] as const)(
      'formats time with locale %s',
      (locale) => {
        const date = new Date(2020, 11, 24, 2, 12);
        expect(formatIntoTime(date, locale)).toBe('02:12');
      }
    );
  });

  describe('formatIntoDate', () => {
    it('returns correctly formatted time', () => {
      const date = new Date(2020, 11, 24, 2, 12);

      expect(formatIntoTime(date)).toMatchInlineSnapshot(`"02:12"`);
    });
  });
});
