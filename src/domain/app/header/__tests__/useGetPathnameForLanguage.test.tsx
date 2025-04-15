// src/domain/app/header/useGetPathnameForLanguage.test.tsx

import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/router';
import { LanguageCodeEnum } from 'react-helsinki-headless-cms';

import { getCmsHref, getHrefForNonCmsPage } from '../../../headless-cms/utils';
import { PATHNAMES } from '../../routes/constants';
import { useCmsLanguageOptions } from '../useCmsLanguageOptions';
import { useGetPathnameForLanguage } from '../useGetPathnameForLanguage';

// --- Mocks ---
// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock useCmsLanguageOptions hook
jest.mock('../useCmsLanguageOptions', () => ({
  useCmsLanguageOptions: jest.fn(),
}));

// Mock utility functions
jest.mock('../../../headless-cms/utils', () => ({
  getCmsHref: jest.fn(),
  getHrefForNonCmsPage: jest.fn(),
}));

// Type assertion for mocks
const mockedUseRouter = useRouter as jest.Mock;
const mockedUseCmsLanguageOptions = useCmsLanguageOptions as jest.Mock;
const mockedGetCmsHref = getCmsHref as jest.Mock;
const mockedGetHrefForNonCmsPage = getHrefForNonCmsPage as jest.Mock;
// --- End Mocks ---

describe('useGetPathnameForLanguage', () => {
  const mockLanguageOptions = [
    { id: '1', locale: LanguageCodeEnum.Fi, slug: 'fi-slug', name: 'Suomi' },
    { id: '2', locale: LanguageCodeEnum.En, slug: 'en-slug', name: 'English' },
  ];
  const mockQuery = { param1: 'value1', param2: 'value2' };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockedUseCmsLanguageOptions.mockReturnValue(mockLanguageOptions);
    mockedGetCmsHref.mockReturnValue('/mocked/cms/path/fi');
    mockedGetHrefForNonCmsPage.mockReturnValue('/mocked/non-cms/path/fi');
  });

  it('should return a function', () => {
    mockedUseRouter.mockReturnValue({
      pathname: '/some/page',
      query: {},
    });
    const { result } = renderHook(() => useGetPathnameForLanguage());
    expect(typeof result.current).toBe('function');
  });

  describe('when on a CMS page', () => {
    beforeEach(() => {
      mockedUseRouter.mockReturnValue({
        pathname: PATHNAMES.CMS_PAGE,
        query: { slug: ['cms', 'page'] }, // Example query for CMS page
      });
    });

    it('should call getCmsHref with correct language code and options', () => {
      const { result } = renderHook(() => useGetPathnameForLanguage());
      const getPathname = result.current;
      const targetLanguage = {
        id: 'suomi',
        code: LanguageCodeEnum.En,
        name: 'English',
      };
      mockedGetCmsHref.mockReturnValueOnce('/mocked/cms/path/en');

      const pathname = getPathname(targetLanguage);

      expect(mockedUseCmsLanguageOptions).toHaveBeenCalledWith({ skip: false });
      expect(mockedGetCmsHref).toHaveBeenCalledTimes(1);
      expect(mockedGetCmsHref).toHaveBeenCalledWith(
        LanguageCodeEnum.En,
        mockLanguageOptions
      );
      expect(mockedGetHrefForNonCmsPage).not.toHaveBeenCalled();
      expect(pathname).toBe('/mocked/cms/path/en');
    });

    it('should use Finnish (Fi) as fallback if language code is missing', () => {
      const { result } = renderHook(() => useGetPathnameForLanguage());
      const getPathname = result.current;
      const targetLanguage = { id: 'suomi', name: 'Suomi' }; // No code property
      mockedGetCmsHref.mockReturnValueOnce('/mocked/cms/path/fi-fallback');

      const pathname = getPathname(targetLanguage);

      expect(mockedGetCmsHref).toHaveBeenCalledTimes(1);
      expect(mockedGetCmsHref).toHaveBeenCalledWith(
        LanguageCodeEnum.Fi, // Fallback code
        mockLanguageOptions
      );
      expect(mockedGetHrefForNonCmsPage).not.toHaveBeenCalled();
      expect(pathname).toBe('/mocked/cms/path/fi-fallback');
    });
  });

  describe('when on a non-CMS page', () => {
    const nonCmsPathname = '/regular/page';

    beforeEach(() => {
      mockedUseRouter.mockReturnValue({
        pathname: nonCmsPathname,
        query: mockQuery,
      });
    });

    it('should call getHrefForNonCmsPage with correct pathname, query, and language code', () => {
      const { result } = renderHook(() => useGetPathnameForLanguage());
      const getPathname = result.current;
      const targetLanguage = {
        id: 'suomi',
        code: LanguageCodeEnum.Sv,
        name: 'Svenska',
      };
      mockedGetHrefForNonCmsPage.mockReturnValueOnce('/mocked/non-cms/path/sv');

      const pathname = getPathname(targetLanguage);

      // Should skip fetching CMS options
      expect(mockedUseCmsLanguageOptions).toHaveBeenCalledWith({ skip: true });
      expect(mockedGetHrefForNonCmsPage).toHaveBeenCalledTimes(1);
      expect(mockedGetHrefForNonCmsPage).toHaveBeenCalledWith(
        nonCmsPathname,
        mockQuery,
        LanguageCodeEnum.Sv
      );
      expect(mockedGetCmsHref).not.toHaveBeenCalled();
      expect(pathname).toBe('/mocked/non-cms/path/sv');
    });

    it('should use Finnish (Fi) as fallback if language code is missing', () => {
      const { result } = renderHook(() => useGetPathnameForLanguage());
      const getPathname = result.current;
      const targetLanguage = { id: 'suomi', name: 'Suomi' }; // No code property
      mockedGetHrefForNonCmsPage.mockReturnValueOnce(
        '/mocked/non-cms/path/fi-fallback'
      );

      const pathname = getPathname(targetLanguage);

      expect(mockedGetHrefForNonCmsPage).toHaveBeenCalledTimes(1);
      expect(mockedGetHrefForNonCmsPage).toHaveBeenCalledWith(
        nonCmsPathname,
        mockQuery,
        LanguageCodeEnum.Fi // Fallback code
      );
      expect(mockedGetCmsHref).not.toHaveBeenCalled();
      expect(pathname).toBe('/mocked/non-cms/path/fi-fallback');
    });
  });
});
