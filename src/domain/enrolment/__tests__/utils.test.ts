import { IsPartOfCulturalRoute } from '../enrolmentForm/constants';
import { validIsPartOfCulturalRouteToBoolean } from '../utils';

describe('validIsPartOfCulturalRouteToBoolean', () => {
  test.each<IsPartOfCulturalRoute | string>([
    IsPartOfCulturalRoute.YES, // Test that the enum version works
    'YES', // Test that the string version also works
  ])('validIsPartOfCulturalRouteToBoolean(%p) returns true', (input) => {
    expect(validIsPartOfCulturalRouteToBoolean(input)).toBe(true);
  });

  test.each<IsPartOfCulturalRoute | string>([
    IsPartOfCulturalRoute.NO_OR_UNKNOWN, // Test that the enum version works
    'NO_OR_UNKNOWN', // Test that the string version also works
  ])('validIsPartOfCulturalRouteToBoolean(%p) returns false', (input) => {
    expect(validIsPartOfCulturalRouteToBoolean(input)).toBe(false);
  });

  test.each(['', ' ', 'yes', 'NO', 'unanswered', null, undefined, true, 0, 1])(
    'validIsPartOfCulturalRouteToBoolean(%p) throws on invalid value',
    (input) => {
      expect(() => validIsPartOfCulturalRouteToBoolean(input)).toThrow(
        `Invalid isPartOfCulturalRoute value ${input}`
      );
    }
  );
});
