import { Footer, Logo, logoFi, logoSv } from 'hds-react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useMenuQuery } from 'react-helsinki-headless-cms/apollo';

import styles from './footer.module.scss';
import { resetFocusId } from '../../../common/components/resetFocus/ResetFocus';
import { DEFAULT_FOOTER_MENU_NAME } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { isFeatureEnabled } from '../../../utils/featureFlags';
import { getIsHrefExternal } from '../../headless-cms/useRHHCConfig';
import { getRoutedInternalHrefForLocale } from '../../headless-cms/utils';

// FIXME: Dynamic import is used here to prevent a hydration issue.
// For some reason, the Link is different in SSR compared to CSR.
// The hydration issue would prevent SSR cache creation for Footer menu links.
// With dynamic import (or by using other link component),
// the hydration issue can be prevented.
const DynamicClientLink = dynamic(
  () => import('react-helsinki-headless-cms').then((mod) => mod.Link),
  {
    ssr: false,
  }
);

const FooterSection = (): React.ReactElement => {
  const { t } = useTranslation();
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
    document.querySelector<HTMLDivElement>(`#${resetFocusId}`)?.focus();
  };

  return (
    <Footer title={t('appName')} className={styles.footer}>
      <Footer.Base
        copyrightHolder={t('footer:copyrightText')}
        copyrightText={t('footer:allRightsReservedText')}
        logo={
          <Logo
            src={locale === 'sv' ? logoSv : logoFi}
            size="medium"
            alt={t('appName')}
          />
        }
        onBackToTopClick={handleBackToTop}
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
