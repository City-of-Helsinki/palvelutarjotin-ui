import React from 'react';

import { useTranslation } from '../../../i18n';
import { MAIN_CONTENT_ID } from '../layout/PageLayout';
import styles from './header.module.scss';
import MobileNavbar from './mobileNavbar/MobileNavbar';
import Navbar from './navbar/Navbar';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <a
        className={styles.skipToContent}
        href={`#${MAIN_CONTENT_ID}`}
        aria-label={t('common:linkSkipToContent')}
      >
        {t('common:linkSkipToContent')}
      </a>
      <MobileNavbar className={styles.mobileNavbar} />
      <Navbar className={styles.navbar} />
    </header>
  );
};

export default Header;
