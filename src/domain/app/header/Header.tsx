import { Navigation, IconGlobe } from 'hds-react';
import React from 'react';

import { SUPPORTED_LANGUAGES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { useTranslation } from '../../../i18n';
import { OptionType } from '../../../types';
import { updateLocaleParam } from '../../../utils/updateLocaleParam';
import { MAIN_CONTENT_ID } from '../layout/PageLayout';
import { ROUTES } from '../routes/constants';
import styles from './header.module.scss';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const languageOptions: OptionType[] = React.useMemo(() => {
    return Object.values(SUPPORTED_LANGUAGES).map((language) => ({
      label: t(`common:languages:${language}`),
      value: language,
    }));
  }, [t]);

  const changeLanguage = (newLanguage: OptionType) => (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const url = window.location.href;
    event.preventDefault();
    window.location.href = updateLocaleParam(url, locale, newLanguage.value);
  };

  const isTabActive = (pathname: string): boolean => {
    return (
      typeof window !== 'undefined' &&
      window.location.pathname.startsWith(pathname)
    );
  };

  const goToPage = (pathname: string) => (
    event?: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event?.preventDefault();
    window.location.href = pathname;
    closeMenu();
  };

  const logoLang = locale === 'sv' ? 'sv' : 'fi';

  const navigationItems = [
    {
      label: t('header:navigation:about'),
      url: `/${locale}${ROUTES.ABOUT}`,
    },
    {
      label: t('header:navigation:culturalEducation'),
      url: `/${locale}${ROUTES.CULTURAL_EDUCATION}`,
    },
    {
      label: t('header:navigation:helsinkiMoving'),
      url: `/${locale}${ROUTES.MOVING}`,
    },
    {
      label: t('header:navigation:forOrganizer'),
      url: `/${locale}${ROUTES.FOR_ORGANIZER}`,
    },
    {
      label: t('header:navigation:now'),
      url: `/${locale}${ROUTES.NOW}`,
    },
  ];

  return (
    <Navigation
      menuOpen={menuOpen}
      onMenuToggle={toggleMenu}
      menuToggleAriaLabel={t('header:menuToggleAriaLabel')}
      skipTo={`#${MAIN_CONTENT_ID}`}
      skipToContentLabel={t('common:linkSkipToContent')}
      className={styles.navigation}
      onTitleClick={goToPage(`/${locale}${ROUTES.HOME}`)}
      logoLanguage={logoLang}
      title={t('common:appName')}
    >
      <Navigation.Row variant="inline">
        {navigationItems.map((item, index) => (
          <Navigation.Item
            key={index}
            active={isTabActive(item.url)}
            className={styles.navigationItem}
            href={item.url}
            label={item.label}
            onClick={goToPage(item.url)}
          />
        ))}
      </Navigation.Row>
      <Navigation.Actions>
        <Navigation.LanguageSelector
          buttonAriaLabel={t('header:changeLanguage')}
          className={styles.languageSelector}
          label={t(`common:languages:${locale}`)}
          icon={<IconGlobe />}
        >
          {languageOptions.map((option) => (
            <Navigation.Item
              key={option.value}
              href="#"
              lang={option.value}
              label={option.label}
              onClick={changeLanguage(option)}
            />
          ))}
        </Navigation.LanguageSelector>
      </Navigation.Actions>
    </Navigation>
  );
};

export default Header;
