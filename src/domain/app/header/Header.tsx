import { ParsedUrlQuery } from 'querystring';

import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import {
  MenuItem,
  Navigation,
  Language as RHHCLanguage,
  LanguageCodeEnum,
} from 'react-helsinki-headless-cms';
import { useMenuQuery } from 'react-helsinki-headless-cms/apollo';

import { DEFAULT_HEADER_MENU_NAME } from '../../../constants';
import { PageIdType, usePageQuery } from '../../../generated/graphql-cms';
import { useCMSClient } from '../../../headless-cms/cmsApolloContext';
import { stripLocaleFromUri } from '../../../headless-cms/utils';
import useLocale from '../../../hooks/useLocale';
import { useNavigationContext } from '../../../navigationProvider/NavigationContext';
import { isFeatureEnabled } from '../../../utils/featureFlags';
import stringifyUrlObject from '../../../utils/stringifyUrlObject';
import { PATHNAMES, ROUTES } from '../routes/constants';
import { getCmsPagePath } from '../routes/utils';

const Header: React.FC = () => {
  const router = useRouter();
  const locale = useLocale();
  const localePath =
    locale !== LanguageCodeEnum.Fi.toLowerCase()
      ? `/${locale.toLowerCase()}`
      : '';
  const isCmsPage = router.pathname === PATHNAMES.CMS_PAGE;
  const { headerMenu: headerMenuFromContext, languages } =
    useNavigationContext();
  const { menu: headerMenu } = useCmsMenuItems({
    skip: !!headerMenuFromContext,
  }) ?? {
    menu: headerMenuFromContext || undefined,
  };
  const languageOptions = useCmsLanguageOptions({ skip: !isCmsPage });

  const getCurrentParsedUrlQuery = useCallback(
    () => ({
      ...router.query,
      ...(window
        ? Object.fromEntries(new URLSearchParams(window.location.search))
        : {}),
    }),
    [router.query]
  );

  const getIsItemActive = (menuItem: MenuItem): boolean => {
    return (
      typeof window !== 'undefined' &&
      window.location.pathname.includes(
        `${localePath}${getCmsPagePath(
          stripLocaleFromUri(menuItem.path ?? '')
        )}`.replace(/\/$/, '')
      )
    );
  };

  // on language switch item click
  const getPathnameForLanguage = (language: RHHCLanguage): string => {
    const languageCode = language.code ?? LanguageCodeEnum.Fi;
    return isCmsPage
      ? getCmsHref(languageCode.toLowerCase())
      : getOriginHref(languageCode);
  };

  const goToPage =
    (pathname: string) =>
    (event?: React.MouseEvent<HTMLAnchorElement> | Event) => {
      event?.preventDefault();
      router.push(pathname);
    };

  const getCmsHref = (lang: string) => {
    const nav = languageOptions?.find((languageOption) => {
      return languageOption.locale?.toLowerCase() === lang;
    });

    // if no translated url found, redirect to root
    if (!nav) {
      return `/${lang}`;
    }
    return `/${lang}${getCmsPagePath(stripLocaleFromUri(nav?.uri ?? ''))}`;
  };

  const getLocalizedCmsItemUrl = (
    pathname: string,
    query: ParsedUrlQuery,
    locale: LanguageCodeEnum
  ): string => {
    const path = `/${locale.toLowerCase()}`;
    return `${path}${stringifyUrlObject({
      query: query,
      pathname,
    })}`;
  };

  const getOriginHref = (language: LanguageCodeEnum): string => {
    return getLocalizedCmsItemUrl(
      router.pathname,
      getCurrentParsedUrlQuery(),
      language
    ).toLocaleLowerCase();
  };

  return (
    <Navigation
      languages={languages}
      menu={headerMenu}
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

export const useCmsMenuItems = ({ skip = false }: { skip?: boolean }) => {
  const locale = useLocale();
  const cmsClient = useCMSClient();
  const { data: navigationData } = useMenuQuery({
    client: cmsClient,
    skip: skip || !isFeatureEnabled('HEADLESS_CMS') || !locale,
    variables: {
      id: DEFAULT_HEADER_MENU_NAME[locale],
      menuIdentifiersOnly: true,
    },
  });

  return {
    menu: navigationData?.menu,
  };
};

export default Header;
