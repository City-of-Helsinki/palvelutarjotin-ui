import { Navigation, IconGlobe, IconSignin } from 'hds-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';

import { SUPPORTED_LANGUAGES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { OptionType } from '../../../types';
import { MAIN_CONTENT_ID } from '../layout/PageLayout';
import { ROUTES } from '../routes/constants';
import styles from './header.module.scss';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navigationLinksEnabled = false;

  const getLanguageOptions = (): OptionType[] => {
    const createOptions = (languages: string[]) =>
      languages.map((language) => ({
        label: t(`header:languages:${language}`),
        value: language as string,
      }));

    if (process.env.NEXT_PUBLIC_LANGUAGE_CIMODE_VISIBLE === 'true') {
      return createOptions([...Object.values(SUPPORTED_LANGUAGES), 'cimode']);
    }
    return createOptions(Object.values(SUPPORTED_LANGUAGES));
  };

  const changeLanguage = (newLanguage: OptionType) => () => {
    router.push(router.asPath, undefined, { locale: newLanguage.value });
  };

  const isTabActive = (pathname: string): boolean => {
    return (
      typeof window !== 'undefined' &&
      window.location.pathname.startsWith(pathname)
    );
  };

  const goToPage =
    (pathname: string) =>
    (event?: React.MouseEvent<HTMLAnchorElement> | Event) => {
      event?.preventDefault();
      router.push(pathname);
      closeMenu();
    };

  const logoLang = locale === 'sv' ? 'sv' : 'fi';

  const navigationItems = [
    {
      label: t('header:navigation:about'),
      url: `/${locale}${ROUTES.HOME}`,
    },
    {
      label: t('header:navigation:culturalEducation'),
      url: `/${locale}${ROUTES.HOME}`,
    },
    {
      label: t('header:navigation:helsinkiMoving'),
      url: `/${locale}${ROUTES.HOME}`,
    },
    {
      label: t('header:navigation:now'),
      url: `/${locale}${ROUTES.HOME}`,
    },
    {
      label: t('header:navigation:forOrganizer'),
      url: `/${locale}${ROUTES.HOME}`,
      icon: <IconSignin />,
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
      {navigationLinksEnabled && (
        <Navigation.Row variant="inline">
          {navigationItems.map((item, index) => (
            <Navigation.Item
              key={index}
              active={isTabActive(item.url)}
              className={styles.navigationItem}
              href={item.url}
              label={item.label}
              onClick={goToPage(item.url)}
              icon={item.icon}
            />
          ))}
        </Navigation.Row>
      )}
      <Navigation.Actions>
        <Navigation.LanguageSelector
          buttonAriaLabel={t('header:changeLanguage')}
          className={styles.languageSelector}
          label={t(`header:languages:${locale}`)}
          icon={<IconGlobe />}
          closeOnItemClick
        >
          {getLanguageOptions().map((option) => (
            <Navigation.Item
              key={option.value}
              // href="#"
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
