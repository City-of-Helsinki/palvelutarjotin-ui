import { Navigation, IconGlobe } from 'hds-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';

import { SUPPORTED_LANGUAGES } from '../../../constants';
import {
  MenuNodeIdTypeEnum,
  useMenuQuery,
} from '../../../generated/graphql-cms';
import { useCMSClient } from '../../../headless-cms/cmsApolloContext';
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
  const cmsClient = useCMSClient();
  const { slug } = router.query;

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

  const changeLanguage = (path: string, locale: string) => () => {
    router.push(path, undefined, { locale });
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

  const { data: navigationData, loading: cmsMenuLoading } = useMenuQuery({
    client: cmsClient,
    skip: !locale,
    variables: {
      id: MENU_NAME.Header,
      idType: MenuNodeIdTypeEnum.Name,
    },
  });

  // contains menu items as arrays with all the translations
  const menuItemArrays = navigationData?.menu?.menuItems?.nodes?.map(
    (menuItem) => {
      const item = menuItem?.connectedNode?.node;
      if (item && 'title' in item) {
        const translationItems = item.translations?.map((translation) => ({
          ...translation,
          locale: translation?.language?.code,
        }));

        return [
          {
            ...item,
            locale: item?.language?.code,
          },
          ...(translationItems ?? []),
        ];
      }

      return null;
    }
  );

  const menuItems = menuItemArrays
    ?.map((item) => {
      return item?.find((i) => i.locale?.toLowerCase() === (locale as string));
    })
    .filter((i) => i);

  const navigationSlugs = menuItemArrays?.find((a) => {
    return a?.some((b) => {
      return b.slug === slug;
    });
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
      {!cmsMenuLoading && navigationData && (
        <Navigation.Row variant="inline">
          {menuItems
            ?.map((item, index) => {
              if (!item?.uri) return null;
              return (
                <Navigation.Item
                  key={index}
                  active={isTabActive(item.id!)}
                  className={styles.navigationItem}
                  label={item.title}
                  onClick={goToPage(
                    `${ROUTES.CMS_PAGE.replace('/:id', item.uri)}`
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
          {getLanguageOptions().map((option) => {
            const nav = navigationSlugs?.find((slug) => {
              return slug.locale?.toLowerCase() === option.value;
            });

            const stripLocaleFormUri = (uri: string) => {
              return uri.replace('/en', '').replace('/sv', '');
            };

            return (
              <Navigation.Item
                key={option.value}
                // as={Link}
                lang={option.value}
                label={option.label}
                onClick={changeLanguage(
                  `/cms-page${nav?.uri ? stripLocaleFormUri(nav?.uri) : ''}`,
                  option.value
                )}
              />
            );
          })}
        </Navigation.LanguageSelector>
      </Navigation.Actions>
    </Navigation>
  );
};

export default Header;
