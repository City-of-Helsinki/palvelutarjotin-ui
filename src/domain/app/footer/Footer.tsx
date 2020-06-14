import classNames from 'classnames';
import { Koros } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Container from '../layout/Container';
import styles from './footer.module.scss';

interface Props {
  isMobileMenuOpen?: boolean;
}

const Footer = ({ isMobileMenuOpen = false }: Props): React.ReactElement => {
  const { t } = useTranslation();

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
          <div className={styles.helsinkiLogo}></div>
          <div className={styles.copyright}>
            <p>{t('footer:copyrightText')}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
