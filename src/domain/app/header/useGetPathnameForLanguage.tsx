import {
  Language as RHHCLanguage,
  LanguageCodeEnum,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { useCmsLanguageOptions } from './useCmsLanguageOptions';
import { getCmsHref, getHrefForNonCmsPage } from '../../headless-cms/utils';
import { PATHNAMES } from '../routes/constants';

export function useGetPathnameForLanguage() {
  const { pathname, query } = useRouter();
  const isCmsPage = pathname === PATHNAMES.CMS_PAGE;
  const languageOptions = useCmsLanguageOptions({ skip: !isCmsPage });

  // Callback function to get the appropriate pathname when switching languages
  const getPathnameForLanguage = useCallback(
    (language: RHHCLanguage): string => {
      const languageCode = language.code ?? LanguageCodeEnum.Fi;
      // If it's a CMS page, get the specific CMS href for that language
      // Otherwise, generate the localized URL for the current non-CMS page
      return isCmsPage
        ? getCmsHref(languageCode, languageOptions)
        : getHrefForNonCmsPage(pathname, query, languageCode);
    },
    [isCmsPage, languageOptions, pathname, query]
  );

  return getPathnameForLanguage;
}
