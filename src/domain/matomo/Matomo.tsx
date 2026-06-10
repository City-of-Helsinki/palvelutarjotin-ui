import {
  createInstance as createMatomoInstance,
  MatomoProvider,
  useMatomo,
} from '@jonkoops/matomo-tracker-react';
import { useCookieConsentContext } from 'hds-react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import getEnvValue from '../../utils/getEnvValue';

const getMatomoUrlPath = (path: string) =>
  `${getEnvValue('NEXT_PUBLIC_MATOMO_URL_BASE')}${path}`;

const matomoInstance = createMatomoInstance({
  disabled: getEnvValue('NEXT_PUBLIC_MATOMO_ENABLED') !== 'true',
  urlBase: getEnvValue('NEXT_PUBLIC_MATOMO_URL_BASE') as string,
  srcUrl:
    getEnvValue('NEXT_PUBLIC_MATOMO_SRC_URL') &&
    getMatomoUrlPath(getEnvValue('NEXT_PUBLIC_MATOMO_SRC_URL') as string),
  trackerUrl:
    getEnvValue('NEXT_PUBLIC_MATOMO_TRACKER_URL') &&
    getMatomoUrlPath(getEnvValue('NEXT_PUBLIC_MATOMO_TRACKER_URL') as string),
  siteId: Number(getEnvValue('NEXT_PUBLIC_MATOMO_SITE_ID')),
});

function Matomo({ children }: { children: React.ReactNode }): JSX.Element {
  if (matomoInstance) {
    return (
      <MatomoProvider value={matomoInstance}>
        <TrackPageViews />
        {children}
      </MatomoProvider>
    );
  }
  return <>{children}</>;
}

function TrackPageViews(): null {
  const { trackPageView, pushInstruction } = useMatomo();
  const { asPath } = useRouter();
  const { consents } = useCookieConsentContext();

  // Track page changes when pathname changes
  useEffect(() => {
    // Check if statistics (Matomo) consent is given
    const statisticsConsent = consents.find(
      (consent) => consent.group === 'statistics'
    );

    if (statisticsConsent?.consented) {
      pushInstruction('setCookieConsentGiven');
    } else {
      pushInstruction('forgetCookieConsentGiven');
    }

    trackPageView({
      href: window.location.href,
    });
  }, [asPath, pushInstruction, trackPageView, consents]);

  return null;
}

export default Matomo;
