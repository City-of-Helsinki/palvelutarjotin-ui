import { useRouter } from 'next/router';
import { useCallback } from 'react';
import {
  Language as RHHCLanguage,
  LanguageCodeEnum,
} from 'react-helsinki-headless-cms';

import { useCmsLanguageOptions } from './useCmsLanguageOptions';
import { getCmsHref, getLocalizedCmsItemUrl } from '../../headless-cms/utils';
import { PATHNAMES } from '../routes/constants';

export function useGetPathnameForLanguage() {
  const router = useRouter();
  const isCmsPage = router.pathname === PATHNAMES.CMS_PAGE;
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

  const getOriginHref = (language: LanguageCodeEnum): string => {
    return getLocalizedCmsItemUrl(
      router.pathname,
      getCurrentParsedUrlQuery(),
      language
    ).toLocaleLowerCase();
  };

  // on language switch item click
  const getPathnameForLanguage = (language: RHHCLanguage): string => {
    const languageCode = language.code ?? LanguageCodeEnum.Fi;
    return isCmsPage
      ? getCmsHref(languageCode.toLowerCase(), languageOptions)
      : getOriginHref(languageCode);
  };

  return getPathnameForLanguage;
}
