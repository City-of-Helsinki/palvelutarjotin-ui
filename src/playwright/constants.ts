export const IN_0s = { timeout: 0 } as const;
export const IN_1s = { timeout: 1_000 } as const;
export const IN_10s = { timeout: 10_000 } as const;
export const IN_20s = { timeout: 20_000 } as const;

export const LANGUAGES = ['fi', 'sv', 'en'] as const;

const SHARED_COOKIE_DATA = {
  path: '/',
  domain: 'localhost',
  expires: -1,
  httpOnly: false,
  secure: false,
  sameSite: 'Lax',
} as const;

export const COOKIE_CONSENT_GIVEN_COOKIES = [
  {
    name: 'city-of-helsinki-consent-version',
    value: '1',
    ...SHARED_COOKIE_DATA,
  },
  {
    name: 'city-of-helsinki-cookie-consents',
    value: encodeURIComponent(
      JSON.stringify({
        wordpress: true,
        linkedevents: true,
        i18next: true,
        'city-of-helsinki-cookie-consents': true,
        'city-of-helsinki-consent-version': true,
        matomo: true,
      })
    ),
    ...SHARED_COOKIE_DATA,
  },
];
