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

import styles from './header.module.scss';
import HeaderNotification from './HeaderNotification';
import { DEFAULT_HEADER_MENU_NAME } from '../../../constants';
import { PageIdType, usePageQuery } from '../../../generated/graphql-cms';
import { useCMSClient } from '../../../headless-cms/cmsApolloContext';
import { HARDCODED_LANGUAGES } from '../../../headless-cms/constants';
import { stripLocaleFromUri } from '../../../headless-cms/utils';
import useLocale from '../../../hooks/useLocale';
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

  const { menu } = useCmsMenuItems();

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
    const path = `/${locale.toLowerCase()}`;
    return `${path}${stringifyUrlObject({
      query: query,
      pathname,
    })}`;
  };

  return (
    <div>
      <Navigation
        languages={HARDCODED_LANGUAGES}
        className={styles.header}
        menu={menu}
        onTitleClick={goToPage(ROUTES.HOME)}
        getIsItemActive={getIsItemActive}
        getPathnameForLanguage={getPathnameForLanguage}
      />
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

const useCmsMenuItems = () => {
  const locale = useLocale();
  const { data: navigationData } = useMenuQuery({
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
