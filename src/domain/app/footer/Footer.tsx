import { Footer } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { Link } from 'react-helsinki-headless-cms';
import { useMenuQuery } from 'react-helsinki-headless-cms/apollo';

import styles from './footer.module.scss';
import { DEFAULT_FOOTER_MENU_NAME } from '../../../constants';
import useLocale from '../../../hooks/useLocale';

const FooterSection = (): React.ReactElement => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { data, loading } = useMenuQuery({
    variables: {
      id: DEFAULT_FOOTER_MENU_NAME[locale],
    },
  });
  return (
    <Footer title={t('appName')} className={styles.footer}>
      <Footer.Base
        copyrightHolder={t('footer:copyrightText')}
        copyrightText={t('footer:allRightsReservedText')}
        logo={<>{t('appName')}</>}
      >
        {!loading &&
          data?.menu?.menuItems?.nodes?.map((navigationItem) => {
            const href =
              navigationItem?.connectedNode?.node &&
              'link' in navigationItem.connectedNode.node
                ? `/${locale}${navigationItem?.connectedNode.node.link}`
                : navigationItem?.path;
            return (
              <Footer.Link
                className={styles.footerLink}
                key={navigationItem?.id}
                as={Link}
                href={href || ''}
                label={navigationItem?.label || undefined}
              />
            );
          })}
      </Footer.Base>
    </Footer>
  );
};

export default FooterSection;
