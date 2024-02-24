import { ParsedUrlQuery } from 'querystring';

import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import {
  MenuItem,
  Navigation,
  Language as RHHCLanguage,
  LanguageCodeEnum,
} from 'react-helsinki-headless-cms';
import {
  useLanguagesQuery,
  useMenuQuery,
} from 'react-helsinki-headless-cms/apollo';

import { DEFAULT_HEADER_MENU_NAME } from '../../../constants';
import { PageIdType, usePageQuery } from '../../../generated/graphql-cms';
import { useCMSClient } from '../../../headless-cms/cmsApolloContext';
import { stripLocaleFromUri } from '../../../headless-cms/utils';
import useLocale from '../../../hooks/useLocale';
import { isFeatureEnabled } from '../../../utils/featureFlags';
import stringifyUrlObject from '../../../utils/stringifyUrlObject';
import { skipFalsyType } from '../../../utils/typescript.utils';
import { PATHNAMES, ROUTES } from '../routes/constants';
import { getCmsPagePath } from '../routes/utils';

const Header: React.FC = () => {
  const router = useRouter();
  const isCmsPage = router.pathname === PATHNAMES.CMS_PAGE;

  const { menu } = useCmsMenuItems();
  const languageOptions = useCmsLanguageOptions({ skip: !isCmsPage });

  const languagesQuery = useLanguagesQuery();

  const getCurrentParsedUrlQuery = useCallback(
    () => ({
      ...router.query,
      ...(window
        ? Object.fromEntries(new URLSearchParams(window.location.search))
        : {}),
    }),
    [router.query]
  );

  const languages = languagesQuery.data?.languages?.filter(skipFalsyType);

  const getIsItemActive = (menuItem: MenuItem): boolean => {
    const pathWithoutTrailingSlash = (menuItem.path ?? '').replace(/\/$/, '');
    return (
      typeof window !== 'undefined' &&
      window.location.pathname.includes(getCmsHref(pathWithoutTrailingSlash))
    );
  };

  const getPathnameForLanguage = (language: RHHCLanguage): string => {
    const languageCode = language.code ?? LanguageCodeEnum.Fi;
    return isCmsPage ? getCmsHref(languageCode) : getOriginHref(languageCode);
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

    return getCmsPagePath(nav?.uri ? stripLocaleFromUri(nav?.uri) : '');
  };

  const getOriginHref = (language: LanguageCodeEnum): string => {
    return getLocalizedCmsItemUrl(
      router.pathname,
      getCurrentParsedUrlQuery(),
      language
    ).toLocaleLowerCase();
  };

  const getLocalizedCmsItemUrl = (
    pathname: string,
    query: ParsedUrlQuery,
    locale: LanguageCodeEnum
  ): string => {
    return `${`/${locale}`}${stringifyUrlObject({
      query: query,
      pathname,
    })}`;
  };

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
      id: DEFAULT_HEADER_MENU_NAME[locale],
      menuIdentifiersOnly: true,
    },
  });

  return {
    menu: navigationData?.menu,
  };
};

export default Header;
