import { useMatomo } from '@datapunt/matomo-tracker-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import useLocale from '../../../hooks/useLocale';
import { useTranslation } from '../../../i18n';

interface Props {
  title?: string;
}

const PageWrapper: React.FC<Props> = ({ children, title = 'appName' }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { trackPageView } = useMatomo();
  const { asPath: pathname } = useRouter();

  const translatedTitle =
    title !== 'appName'
      ? `${t(title)} - ${t('common:appName')}`
      : t('common:appName');

  // Track page changes when pathnname changes
  useEffect(() => {
    trackPageView({
      href: window.location.href,
    });
  }, [pathname, trackPageView]);

  let path = pathname.replace(`/${locale}`, '');
  path = path.startsWith('/') ? path.slice(1) : path;

  return (
    <div>
      <Head>
        <title>{translatedTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="alternate" hrefLang="fi" href={'/fi/' + path} />
        <link rel="alternate" hrefLang="sv" href={'/sv/' + path} />
        <link rel="alternate" hrefLang="en" href={'/en/' + path} />
      </Head>
      <main>{children}</main>
    </div>
  );
};

export default PageWrapper;
