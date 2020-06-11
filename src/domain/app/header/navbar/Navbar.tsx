import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Link } from '../../../../i18n';
import Container from '../../layout/Container';
import LanguageDropdown from '../languageDropdown/LanguageDropdown';
import styles from './navbar.module.scss';

const Navbar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <div className={styles.navbar}>
        <div className={styles.logoWrapper}>
          <Link
            aria-label={t('header:ariaLabelLogo')}
            href={'/'}
            passHref={true}
          >
            <a href="/">
              <div className={styles.logo} />
              <div className={styles.appName}>{t('common:appName')}</div>
            </a>
          </Link>
        </div>

        <LanguageDropdown />
      </div>
    </Container>
  );
};

export default Navbar;
