import classNames from 'classnames';
import { Koros } from 'hds-react';
import React from 'react';

import { PRIVACY_POLICY_LINKS } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { useTranslation, Link } from '../../../i18n';
import Container from '../layout/Container';
import styles from './footer.module.scss';

interface Props {
  isMobileMenuOpen?: boolean;
}

const Footer = ({ isMobileMenuOpen = false }: Props): React.ReactElement => {
  const { t } = useTranslation();
  const locale = useLocale();

  return (
    <footer
      aria-hidden={isMobileMenuOpen}
      className={classNames(styles.footer, {
        [styles.mobileMenuOpen]: isMobileMenuOpen,
      })}
    >
      <Koros className={styles.koros} />
      <Container>
        <div className={styles.contentWrapper}>
          <div className={styles.helsinkiLogo} />
          <div className={styles.copyright}>
            <div>{t('footer:copyrightText')}</div>
            <div className={styles.links}>
              <a
                href={PRIVACY_POLICY_LINKS[locale]}
                target="_blank"
                rel="noreferrer"
              >
                {t('common:privacyPolicy')}
              </a>{' '}
              •{' '}
              <Link href="/accessibility">
                {t('common:accessibilityStatement.title')}
              </Link>{' '}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
