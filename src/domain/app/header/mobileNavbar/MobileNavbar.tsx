import { IconCross, IconMenuHamburger } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Link } from '../../../../i18n';
import Container from '../../layout/Container';
import { ROUTES } from '../../routes/constants';
import { closeMobileMenu, openMobileMenu } from '../mobileMenu/actions';
import MobileMenu from '../mobileMenu/MobileMenu';
import { isMobileMenuOpenSelector } from '../mobileMenu/selectors';
import styles from './mobileNavbar.module.scss';

export const testIds = {
  toggleButton: 'mobile-navbar-toggle-button',
};

const MOBILE_MENU_ID = 'mobile-menu';

interface Props {
  className?: string;
}

const MobileNavbar: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const isMenuOpen = useSelector(isMobileMenuOpenSelector);
  const dispatch = useDispatch();

  const handleCloseMenu = () => {
    dispatch(closeMobileMenu());
  };

  const handleOpenMenu = () => {
    dispatch(openMobileMenu());
  };

  return (
    <>
      <div className={className}>
        <Container>
          <nav className={styles.mobileNavbar}>
            <Link href={ROUTES.HOME} passHref={true}>
              <a
                aria-label={t('header:ariaLabelLogo')}
                className={styles.appNameLink}
                href={ROUTES.HOME}
                onClick={handleCloseMenu}
              >
                <div className={styles.logo} />
                <div className={styles.appName}>{t('common:appName')}</div>
              </a>
            </Link>
            <div className={styles.buttonWrapper}>
              {isMenuOpen ? (
                <button
                  className={styles.iconButton}
                  onClick={handleCloseMenu}
                  aria-expanded={isMenuOpen}
                  aria-label={t('header:ariaLabelCloseMenu')}
                  data-testid={testIds.toggleButton}
                >
                  <IconCross />
                </button>
              ) : (
                <button
                  className={styles.iconButton}
                  onClick={handleOpenMenu}
                  aria-expanded={isMenuOpen}
                  aria-label={t('header:ariaLabelOpenMenu')}
                  data-testid={testIds.toggleButton}
                >
                  <IconMenuHamburger />
                </button>
              )}
            </div>
            <MobileMenu
              id={MOBILE_MENU_ID}
              isMenuOpen={isMenuOpen}
              onClose={handleCloseMenu}
            />
          </nav>
        </Container>
      </div>
    </>
  );
};

export default MobileNavbar;
