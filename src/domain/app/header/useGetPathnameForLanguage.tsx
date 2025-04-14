import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import {
  Language as RHHCLanguage,
  LanguageCodeEnum,
} from 'react-helsinki-headless-cms';

import { useCmsLanguageOptions } from './useCmsLanguageOptions';
import { getCmsHref, getLocalizedCmsItemUrl } from '../../headless-cms/utils';
import { PATHNAMES } from '../routes/constants';

export function useGetPathnameForLanguage() {
  const { pathname, query } = useRouter();
  const isCmsPage = pathname === PATHNAMES.CMS_PAGE;
  const languageOptions = useCmsLanguageOptions({ skip: !isCmsPage });

  const currentParsedUrlQuery = useMemo(() => {
    const searchParams = window
      ? Object.fromEntries(new URLSearchParams(window.location.search))
      : {};
    return {
      ...query,
      ...searchParams,
    };
  }, [query]);

  const getOriginHref = useCallback(
    (language: LanguageCodeEnum): string => {
      return getLocalizedCmsItemUrl(
        pathname,
        currentParsedUrlQuery,
        language
      ).toLocaleLowerCase();
    },
    [pathname, currentParsedUrlQuery]
  );

  // on language switch item click
  const getPathnameForLanguage = useCallback(
    (language: RHHCLanguage): string => {
      const languageCode = language.code ?? LanguageCodeEnum.Fi;
      return isCmsPage
        ? getCmsHref(languageCode.toLowerCase(), languageOptions)
        : getOriginHref(languageCode);
    },
    [isCmsPage, languageOptions, getOriginHref]
  );

  return getPathnameForLanguage;
}
