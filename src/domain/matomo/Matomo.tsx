import {
  createInstance as createMatomoInstance,
  MatomoProvider,
  useMatomo,
} from '@datapunt/matomo-tracker-react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const getMatomoUrlPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_MATOMO_URL_BASE}${path}`;

const matomoInstance = createMatomoInstance({
  disabled: process.env.NEXT_PUBLIC_MATOMO_ENABLED !== 'true',
  urlBase: process.env.NEXT_PUBLIC_MATOMO_URL_BASE as string,
  srcUrl:
    process.env.NEXT_PUBLIC_MATOMO_SRC_URL &&
    getMatomoUrlPath(process.env.NEXT_PUBLIC_MATOMO_SRC_URL),
  trackerUrl:
    process.env.NEXT_PUBLIC_MATOMO_TRACKER_URL &&
    getMatomoUrlPath(process.env.NEXT_PUBLIC_MATOMO_TRACKER_URL),
  siteId: Number(process.env.NEXT_PUBLIC_MATOMO_SITE_ID),
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
  const { trackPageView } = useMatomo();
  const { asPath } = useRouter();

  // Track page changes when pathnname changes
  useEffect(() => {
    trackPageView({
      href: window.location.href,
    });
  }, [asPath, trackPageView]);

  return null;
}

export default Matomo;
