import { useMenuQuery } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';
import { Footer, Logo, LogoSize, logoFi, logoSv } from 'hds-react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import React from 'react';

import styles from './footer.module.scss';
import { DEFAULT_FOOTER_MENU_NAME } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import type { I18nNamespace } from '../../../types';
import { isFeatureEnabled } from '../../../utils/featureFlags';
import { getIsHrefExternal } from '../../headless-cms/useRHHCConfig';
import { getRoutedInternalHrefForLocale } from '../../headless-cms/utils';

// NOTE: Dynamic import avoids an SSR/CSR hydration mismatch with RHHC Link
// (Link markup differed between server and client). That mismatch would prevent
// SSR cache creation for Footer menu links. Client-only load keeps links stable.
const DynamicClientLink = dynamic(
  () =>
    import('@city-of-helsinki/react-helsinki-headless-cms').then(
      (mod) => mod.Link
    ),
  {
    ssr: false,
  }
);

const FooterSection = (): React.ReactElement => {
  const { t } = useTranslation<I18nNamespace>();
  const locale = useLocale();
  const { data, loading } = useMenuQuery({
    skip: !isFeatureEnabled('HEADLESS_CMS') || !locale,
    variables: {
      id: DEFAULT_FOOTER_MENU_NAME[locale],
      menuIdentifiersOnly: true,
    },
  });

  // override Footer component default behaviour which focuses skip-link
  const handleBackToTop = () => {
    window?.scrollTo({ top: 0 });
  };

  return (
    <Footer title={t('appName')} className={styles.footer}>
      <Footer.Base
        copyrightHolder={t('footer:copyrightText')}
        copyrightText={t('footer:allRightsReservedText')}
        logo={
          <Logo
            src={locale === 'sv' ? logoSv : logoFi}
            size={LogoSize.Medium}
            alt={t('appName')}
          />
        }
        onBackToTopClick={handleBackToTop}
        className={styles.footerBase}
      >
        {!loading &&
          data?.menu?.menuItems?.nodes?.map((navigationItem) => {
            const path = navigationItem?.path ?? '';
            const href = getIsHrefExternal(path)
              ? path
              : getRoutedInternalHrefForLocale(locale, path);
            return (
              <Footer.Link
                className={styles.footerLink}
                key={navigationItem?.id}
                as={DynamicClientLink}
                href={href}
                label={navigationItem?.label || undefined}
              />
            );
          })}
      </Footer.Base>
    </Footer>
  );
};

export default FooterSection;
