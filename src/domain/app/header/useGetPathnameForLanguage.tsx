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
  const { pathname, query } = useRouter();
  const isCmsPage = pathname === PATHNAMES.CMS_PAGE;
  const languageOptions = useCmsLanguageOptions({ skip: !isCmsPage });

  // Generates the target URL for the current non-CMS page in the specified language
  const getHrefForNonCmsPage = useCallback(
    (language: LanguageCodeEnum): string => {
      return getLocalizedCmsItemUrl(
        pathname,
        query,
        language
      ).toLocaleLowerCase();
    },
    [pathname, query]
  );

  // Callback function to get the appropriate pathname when switching languages
  const getPathnameForLanguage = useCallback(
    (language: RHHCLanguage): string => {
      const languageCode = language.code ?? LanguageCodeEnum.Fi;

      // If it's a CMS page, get the specific CMS href for that language
      // Otherwise, generate the localized URL for the current non-CMS page
      return isCmsPage
        ? getCmsHref(languageCode.toLowerCase(), languageOptions)
        : getHrefForNonCmsPage(languageCode);
    },
    [isCmsPage, languageOptions, getHrefForNonCmsPage]
  );

  return getPathnameForLanguage;
}
