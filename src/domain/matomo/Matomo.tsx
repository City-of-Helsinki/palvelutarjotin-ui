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

const isMatomoEnabled = getEnvValue('NEXT_PUBLIC_MATOMO_ENABLED') === 'true';
const matomoUrlBase = getEnvValue('NEXT_PUBLIC_MATOMO_URL_BASE');

if (isMatomoEnabled && !matomoUrlBase) {
  // eslint-disable-next-line no-console
  console.warn(
    'Warning: Matomo is enabled but NEXT_PUBLIC_MATOMO_URL_BASE is missing. Matomo tracking is disabled.'
  );
}

const matomoInstance =
  isMatomoEnabled && matomoUrlBase
    ? createMatomoInstance({
        disabled: false,
        urlBase: matomoUrlBase,
        srcUrl:
          getEnvValue('NEXT_PUBLIC_MATOMO_SRC_URL') &&
          getMatomoUrlPath(getEnvValue('NEXT_PUBLIC_MATOMO_SRC_URL') as string),
        trackerUrl:
          getEnvValue('NEXT_PUBLIC_MATOMO_TRACKER_URL') &&
          getMatomoUrlPath(
            getEnvValue('NEXT_PUBLIC_MATOMO_TRACKER_URL') as string
          ),
        siteId: Number(getEnvValue('NEXT_PUBLIC_MATOMO_SITE_ID')),
      })
    : undefined;

interface MatomoProps {
  children: React.ReactNode;
}

function Matomo({ children }: Readonly<MatomoProps>): React.ReactElement {
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
