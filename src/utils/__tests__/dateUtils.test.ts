import { formatDate } from '../dateUtils';

describe('formatDate function', () => {
  it('format date value', () => {
    expect(formatDate(null)).toBe('');

    expect(formatDate(new Date('2019-11-08T12:27:34+02:00'))).toBe('8.11.2019');

    expect(
      formatDate(new Date('2019-11-08T12:27:34+02:00'), 'd.M.yyy hh:mm')
    ).toBe('8.11.2019 12:27');

    expect(formatDate(500000000000)).toBe('5.11.1985');
  });
});
