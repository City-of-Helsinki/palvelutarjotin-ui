import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Link } from '../../../../i18n';
import Container from '../../layout/Container';
import { ROUTES } from '../../routes/constants';
import LanguageDropdown from '../languageDropdown/LanguageDropdown';
import styles from './navbar.module.scss';

interface Props {
  className?: string;
}

const Navbar: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <Container>
        <div className={styles.navbar}>
          <div className={styles.logoWrapper}>
            <Link href={ROUTES.HOME} passHref={true}>
              <a href={ROUTES.HOME} aria-label={t('header:ariaLabelLogo')}>
                <div className={styles.logo} />
                <div className={styles.appName}>{t('common:appName')}</div>
              </a>
            </Link>
          </div>

          <LanguageDropdown />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
