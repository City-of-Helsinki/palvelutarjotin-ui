//import { Navigation, IconGlobe } from 'hds-react';
import NextLink, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React from 'react';

import styles from './header.module.scss';
import HeaderNotification from './HeaderNotification';
import { SUPPORTED_LANGUAGES } from '../../../constants';
import {
  MenuNodeIdTypeEnum,
  CmsMenuPageFieldsFragment,
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
import { getCmsPagePath } from '../routes/utils';
import { MenuItem, Navigation } from 'react-helsinki-headless-cms';
import { useLanguagesQuery } from 'react-helsinki-headless-cms/apollo';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const router = useRouter();
  const isCmsPage = router.pathname === PATHNAMES.CMS_PAGE;

  const [menuOpen, setMenuOpen] = React.useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const { menu } = useCmsMenuItems();
  const languageOptions = useCmsLanguageOptions({ skip: !isCmsPage });

  const languagesQuery = useLanguagesQuery();
  const languages = languagesQuery.data?.languages?.filter(skipFalsyType);

  const getIsItemActive = (menuItem: MenuItem): boolean => {
    const pathWithoutTrailingSlash = (menuItem.path ?? '').replace(/\/$/, '');
    return (
      typeof window !== 'undefined' &&
      window.location.pathname.includes(getCmsHref(pathWithoutTrailingSlash))
    );
  };

  const getPathnameForLanguage = (language: any): string => {
    // const languageCode = language.code ?? LanguageCodeEnum.Fi;
    return '';
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

    return getCmsPagePath(nav?.uri ? stripLocaleFromUri(nav?.uri) : '');
  };

  const logoLang = locale === 'sv' ? 'sv' : 'fi';

  return (
    <Navigation
      languages={languages}
      menu={menu}
      onTitleClick={goToPage(ROUTES.HOME)}
      getIsItemActive={getIsItemActive}
      getPathnameForLanguage={getPathnameForLanguage}
    />
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

const useCmsMenuItems = () => {
  const locale = useLocale();
  const cmsClient = useCMSClient();
  const { data: navigationData, loading: cmsMenuLoading } = useMenuQuery({
    client: cmsClient,
    skip: !isFeatureEnabled('HEADLESS_CMS') || !locale,
    variables: {
      id: MENU_NAME.Header,
      idType: MenuNodeIdTypeEnum.Name,
    },
  });

  return {
    navigationData,
    cmsMenuLoading,
    menu: navigationData?.menu,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPageNode = (node?: any): node is CmsMenuPageFieldsFragment => {
  return Boolean(node && 'title' in node);
};

export default Header;
