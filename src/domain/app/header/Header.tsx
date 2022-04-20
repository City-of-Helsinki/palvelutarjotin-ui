import { Navigation, IconGlobe } from 'hds-react';
import { useTranslation } from 'next-i18next';
import NextLink, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { SUPPORTED_LANGUAGES } from '../../../constants';
import {
  MenuNodeIdTypeEnum,
  MenuPageFieldsFragment,
  PageIdType,
  useMenuQuery,
  usePageQuery,
} from '../../../generated/graphql-cms';
import { useCMSClient } from '../../../headless-cms/cmsApolloContext';
import { MENU_NAME } from '../../../headless-cms/constants';
import { stripLocaleFromUri } from '../../../headless-cms/utils';
import useLocale from '../../../hooks/useLocale';
import { OptionType } from '../../../types';
import { isFeatureEnabled } from '../../../utils/featureFlags';
import { skipFalsyType } from '../../../utils/typescript.utils';
import { MAIN_CONTENT_ID } from '../layout/PageLayout';
import { PATHNAMES, ROUTES } from '../routes/constants';
import { getCmsPath } from '../routes/utils';
import styles from './header.module.scss';
import HeaderNotification from './HeaderNotification';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const router = useRouter();
  const isCmsPage = router.pathname === PATHNAMES.CMS_PAGE;

  const [menuOpen, setMenuOpen] = React.useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const { navigationData, cmsMenuLoading, menuItems } = useCmsMenuItems();
  const languageOptions = useCmsLanguageOptions({ skip: !isCmsPage });

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

  const isTabActive = (uri: string): boolean => {
    const uriWithoutEndingSlash = uri.replace(/\/$/, '');
    return router.asPath.includes(uriWithoutEndingSlash);
  };

  const goToPage =
    (pathname: string) =>
    (event?: React.MouseEvent<HTMLAnchorElement> | Event) => {
      event?.preventDefault();
      router.push(pathname);
      closeMenu();
    };

  const getCmsHref = (lang: string) => {
    const nav = languageOptions?.find((languageOption) => {
      return languageOption.locale?.toLowerCase() === lang;
    });

    return getCmsPath(nav?.uri ? stripLocaleFromUri(nav?.uri) : '');
  };

  const logoLang = locale === 'sv' ? 'sv' : 'fi';

  return (
    <div>
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
                if (!item?.id) return null;
                if (!!item.children?.length) {
                  return (
                    <Navigation.Dropdown
                      key={item.id}
                      label={item.title}
                      closeOnItemClick
                      active={isTabActive(getCmsPath(item?.uri ?? ''))}
                    >
                      <Navigation.Item
                        label={item.title}
                        as={Link}
                        href={getCmsPath(stripLocaleFromUri(item.uri ?? ''))}
                        lang={locale}
                        locale={locale}
                      />
                      {item.children.map((child) => {
                        return (
                          <Navigation.Item
                            key={child.id}
                            label={child?.title}
                            as={Link}
                            href={getCmsPath(
                              stripLocaleFromUri(child?.uri ?? '')
                            )}
                            lang={locale}
                            locale={locale}
                          />
                        );
                      })}
                    </Navigation.Dropdown>
                  );
                } else {
                  const uri = getCmsPath(item.uri);
                  return (
                    <Navigation.Item
                      key={index}
                      active={isTabActive(uri)}
                      label={item.title}
                      as={Link}
                      href={uri}
                      lang={locale}
                      locale={locale}
                    />
                  );
                }
              })
              .filter((item) => item != null)}
          </Navigation.Row>
        )}
        <Navigation.Actions>
          <Navigation.LanguageSelector
            buttonAriaLabel={t('header:changeLanguage')}
            className={styles.languageSelector}
            label={t(`header:languages.${locale}`)}
            icon={<IconGlobe />}
            closeOnItemClick
          >
            {getLanguageOptions().map((option) => {
              const href = isCmsPage ? getCmsHref(option.value) : router.asPath;
              return (
                <Navigation.Item
                  key={option.value}
                  as={Link}
                  href={href}
                  lang={option.value}
                  locale={option.value}
                  label={option.label}
                />
              );
            })}
          </Navigation.LanguageSelector>
        </Navigation.Actions>
      </Navigation>
      <HeaderNotification />
    </div>
  );
};

const useCmsLanguageOptions = ({ skip = false }: { skip?: boolean } = {}) => {
  const router = useRouter();
  const cmsClient = useCMSClient();

  const { data: pageData } = usePageQuery({
    client: cmsClient,
    variables: {
      id: `${router.asPath.replace('/cms-page', '')}/`,
      idType: PageIdType.Uri,
    },
    skip,
  });

  return !skip
    ? [
        {
          uri: pageData?.page?.uri,
          locale: pageData?.page?.language?.code?.toLowerCase(),
        },
        ...(pageData?.page?.translations?.map((translation) => ({
          uri: translation?.uri,
          locale: translation?.language?.code?.toLowerCase(),
        })) ?? []),
      ]
    : [];
};

const Link: React.FC<LinkProps & { lang: string }> = ({
  href,
  children,
  locale,
  ...rest
}) => {
  return (
    <NextLink href={href} locale={locale}>
      <a {...rest}>{children}</a>
    </NextLink>
  );
};

const useCmsMenuItems = () => {
  const locale = useLocale();
  const router = useRouter();
  const cmsClient = useCMSClient();
  const { slug } = router.query;
  const { data: navigationData, loading: cmsMenuLoading } = useMenuQuery({
    client: cmsClient,
    skip: !isFeatureEnabled('HEADLESS_CMS') || !locale,
    variables: {
      id: MENU_NAME.Header,
      idType: MenuNodeIdTypeEnum.Name,
    },
  });

  // contains menu items as arrays with all the translations
  const menuItemArrays = navigationData?.menu?.menuItems?.nodes?.map(
    (menuItem) => {
      const item = menuItem?.connectedNode?.node;
      if (isPageNode(item)) {
        const translationItems = item.translations?.map((translation) => ({
          ...translation,
          locale: translation?.language?.code,
          uri: stripLocaleFromUri(translation?.uri ?? ''),
          // find all child translations that have same language
          children: item.children?.nodes
            ?.filter(isPageNode)
            .map((childNode) =>
              childNode.translations?.find(
                (childTranslation) =>
                  translation?.language?.code ===
                  childTranslation?.language?.code
              )
            )
            .filter(skipFalsyType),
        }));

        return [
          {
            ...item,
            locale: item?.language?.code,
            uri: stripLocaleFromUri(item.uri ?? ''),
            children: item.children?.nodes?.filter(isPageNode),
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
      if (Array.isArray(slug)) {
        return b.slug === slug?.[0];
      }
      return false;
    });
  });

  return {
    navigationData,
    cmsMenuLoading,
    menuItems,
    navigationSlugs,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPageNode = (node?: any): node is MenuPageFieldsFragment => {
  return Boolean(node && 'title' in node);
};

export default Header;
