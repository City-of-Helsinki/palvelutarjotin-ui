import { Navigation, IconGlobe } from 'hds-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';

import { SUPPORTED_LANGUAGES } from '../../../constants';
import {
  LanguageCodeEnum,
  MenuNodeIdTypeEnum,
  Page,
  useMenuQuery,
} from '../../../generated/graphql-cms';
import apolloClient from '../../../headless-cms/client';
import { MENU_NAME } from '../../../headless-cms/constants';
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

  const { data: navigationItems, loading: cmsMenuLoading } = useMenuQuery({
    client: apolloClient,
    skip: !locale,
    variables: {
      id: MENU_NAME.Header,
      idType: MenuNodeIdTypeEnum.Name,
      language: locale.toString().toUpperCase() as LanguageCodeEnum,
    },
  });

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
      {!cmsMenuLoading && navigationItems && (
        <Navigation.Row variant="inline">
          {navigationItems?.menu?.menuItems?.nodes
            ?.map((node, index) => {
              const page = node?.connectedNode?.node as Page;
              const item = page?.translation;
              if (!item) return null;
              const translatedPageId = item.id as string;
              return (
                <Navigation.Item
                  key={index}
                  active={isTabActive(item.id)}
                  className={styles.navigationItem}
                  label={item.title}
                  onClick={goToPage(
                    `${ROUTES.CMS_PAGE.replace(':id', translatedPageId)}`
                  )}
                />
              );
            })
            .filter((item) => item != null)}
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
