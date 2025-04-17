import { getCookieConsentGivenCookies } from '../getCookieConsentGivenCookies';

const sharedCookieData = {
  expires: -1,
  httpOnly: false,
  path: '/',
  sameSite: 'Lax',
  secure: false,
} as const;

const encodedCookieConsent =
  // eslint-disable-next-line max-len
  '%7B%22wordpress%22%3Atrue%2C%22linkedevents%22%3Atrue%2C%22i18next%22%3Atrue%2C%22city-of-helsinki-cookie-consents%22%3Atrue%2C%22city-of-helsinki-consent-version%22%3Atrue%2C%22matomo%22%3Atrue%7D' as const;

describe('getCookieConsentGivenCookies', () => {
  test.each([
    {
      domain: 'localhost',
      expectedResult: [
        {
          domain: 'localhost',
          name: 'city-of-helsinki-consent-version',
          value: '1',
          ...sharedCookieData,
        },
        {
          domain: 'localhost',
          name: 'city-of-helsinki-cookie-consents',
          value: encodedCookieConsent,
          ...sharedCookieData,
        },
      ],
    },
    {
      domain: 'kultus.hel.fi',
      expectedResult: [
        {
          domain: '.kultus.hel.fi',
          name: 'city-of-helsinki-consent-version',
          value: '1',
          ...sharedCookieData,
        },
        {
          domain: '.kultus.hel.fi',
          name: 'city-of-helsinki-cookie-consents',
          value: encodedCookieConsent,
          ...sharedCookieData,
        },
      ],
    },
  ])(
    'getCookieConsentGivenCookies({ domain: "$domain"}) returns expected result',
    ({ domain, expectedResult }) => {
      expect(getCookieConsentGivenCookies({ domain })).toStrictEqual(
        expectedResult
      );
    }
  );
});
