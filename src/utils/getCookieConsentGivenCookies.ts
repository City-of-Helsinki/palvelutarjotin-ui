type CookieProps = {
  domain: string;
};

const getSharedCookieData = ({ domain }: CookieProps) =>
  ({
    path: '/',
    domain: domain == 'localhost' ? domain : `.${domain}`,
    expires: -1,
    httpOnly: false,
    secure: false,
    sameSite: 'Lax',
  }) as const;

/**
 * Get the cookies that are set when the user has given consent to all cookies.
 * @param props - Cookie properties, e.g. domain
 */
export const getCookieConsentGivenCookies = (props: CookieProps) => [
  {
    name: 'city-of-helsinki-consent-version',
    value: '1',
    ...getSharedCookieData(props),
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
    ...getSharedCookieData(props),
  },
];
