import { ParsedUrlQuery } from 'querystring';

import {
  ModuleItemTypeEnum,
  LanguageCodeEnum,
  MenuItem,
} from 'react-helsinki-headless-cms';
import {
  MenuDocument,
  MenuQueryVariables,
  MenuQuery,
} from 'react-helsinki-headless-cms/apollo';

import { initializeCMSApolloClient } from './apollo/apolloClient';
import AppConfig from './config';
import {
  DEFAULT_FOOTER_MENU_NAME,
  DEFAULT_HEADER_MENU_NAME,
} from '../../constants';
import type { Language } from '../../types';
import stringifyUrlObject from '../../utils/stringifyUrlObject';
import { getCmsArticlePath, getCmsPagePath } from '../app/routes/utils';

/**
 * Generates a URI ID based on an array of slugs and a locale.
 * Prepends the locale to the slugs for all languages except Finnish.
 *
 * @param slugs An array of URI slugs.
 * @param locale The current locale ('fi', 'sv', or 'en').
 * @returns The generated URI ID with leading and trailing slashes. Returns '/' if no slugs are provided.
 */
export const getUriID = (slugs: string[], locale: Language): string => {
  if (!slugs) return '/';
  if (locale === 'fi') {
    return `/${slugs.join('/')}/`;
  }
  return `/${locale}/${slugs.join('/')}/`;
};

/**
 * Extracts an array of slugs from a URI string by removing the locale prefix and splitting the remaining path.
 *
 * @param uri The URI string (can be null or undefined).
 * @returns An array of slugs, or null if the URI (after stripping locale) is empty.
 */
export const getSlugFromUri = (uri?: string | null): string[] | null => {
  const uriWithoutLang = stripLocaleFromUri(uri ?? '');
  if (uriWithoutLang) {
    return uriWithoutLang.split('/').filter((i) => i);
  }
  return null;
};

/**
 * Strips the locale prefix (/en, /sv, /fi) from the beginning of a URI string (case-insensitive).
 *
 * @param uri The URI string.
 * @returns The URI without the leading locale prefix.
 */
export const stripLocaleFromUri = (uri: string): string => {
  return uri.replace(/^\/(en|sv|fi)(?![a-z0-9])/i, '');
};

/**
 * Removes the trailing slash from a URI string.
 *
 * @param uri The URI string.
 * @returns The URI without a trailing slash.
 */
export const removeTrailingSlash = (uri: string): string => {
  return uri.replace(/\/$/, '');
};

/**
 * Converts a URI into an array of breadcrumb segments.
 * It strips the locale, splits the URI into slugs, and then transforms these
 * slugs into URI segments with leading and trailing slashes.
 *
 * Example:
 * '/segment1/segment2/' -> ['/segment1/', '/segment1/segment2/']
 *
 * current implementation required both leading and trailing slashes
 * to include all breadcrumbs
 *
 * @param uri The URI string.
 * @returns An array of breadcrumb URI segments. Returns an empty array for an empty URI after stripping the locale.
 */
export const uriToBreadcrumbs = (uri: string): string[] => {
  return slugsToUriSegments(
    stripLocaleFromUri(uri)
      .split('/')
      // Filter out empty strings
      .filter((i) => i)
  );
};

/**
 * Converts an array of slugs into an array of URI segments, where each segment includes all preceding slugs.
 * Each segment has a leading and a trailing slash.
 *
 * @param slugs An array of URI slugs.
 * @returns An array of URI segments.
 */
export const slugsToUriSegments = (slugs: string[]): string[] => {
  return slugs.map((slug, index) => {
    return `/${slugs.slice(0, index + 1).join('/')}/`;
  });
};

export type PageInfo = { uri: string; slug: string; locale: Language };

/**
 * A valid Page object from MenuQuery
 * i.e. the needed fields are not null or undefined.
 */
type ValidPage = {
  __typename: 'Page';
  uri: string;
  slug: string;
  language: {
    code: LanguageCodeEnum;
  };
};

/** Mapping from LanguageCodeEnum to Language. */
const LANGUAGE_CODE_ENUM_TO_LANGUAGE = {
  [LanguageCodeEnum.En]: 'en',
  [LanguageCodeEnum.Fi]: 'fi',
  [LanguageCodeEnum.Sv]: 'sv',
} as const satisfies Record<LanguageCodeEnum, Language>;

/**
 * Checks if a given node from a MenuQuery result is a valid `Page` object.
 *
 * @param node The node to check.
 * @returns True if the node is a valid `Page` object, false otherwise.
 */
const isValidPage = (node: unknown): node is ValidPage => {
  return Boolean(
    typeof node === 'object' &&
      node !== null &&
      '__typename' in node &&
      node.__typename === 'Page' &&
      'uri' in node &&
      'slug' in node &&
      'language' in node &&
      typeof node.language === 'object' &&
      node.language !== null &&
      'code' in node.language &&
      typeof node.uri === 'string' &&
      typeof node.slug === 'string' &&
      typeof node.language.code === 'string' &&
      Object.values<string>(LanguageCodeEnum).includes(node.language.code)
  );
};

/**
 * Converts a valid `Page` object from the MenuQuery into a `PageInfo` object.
 *
 * @param node A valid `Page` object.
 * @returns A `PageInfo` object containing the URI, slug, and locale.
 */
const nodeToPageInfo = (node: ValidPage): PageInfo => {
  return {
    uri: node.uri,
    slug: node.slug,
    locale: LANGUAGE_CODE_ENUM_TO_LANGUAGE[node.language.code],
  };
};

/**
 * Recursively extracts all `PageInfo` objects from a given node, including its connected translations.
 *
 * @param node The node to traverse.
 * @returns An array of `PageInfo` objects found within the node and its translations.
 */
const getPageInfosFromNode = (node: unknown): PageInfo[] => {
  const result: PageInfo[] = [];

  if (isValidPage(node)) {
    result.push(nodeToPageInfo(node));
  }

  return result;
};

/**
 * Fetches all unique menu pages from the headless CMS for all configured languages.
 * It queries both the header and footer menus and extracts page information,
 * ensuring no duplicate pages are included in the final result.
 *
 * @returns A promise that resolves to an array of unique `PageInfo` objects, sorted alphabetically by slug.
 */
export const getAllMenuPages = async (): Promise<PageInfo[]> => {
  // Slug to page info mapping to avoid duplicates. Slugs must be unique i.e.
  // slug should be able to be used to identify a page in a specific language.
  const slugToPageInfo: Record<string, PageInfo> = {};
  const cmsClient = initializeCMSApolloClient();

  const menuIds = [
    ...Object.values(DEFAULT_HEADER_MENU_NAME),
    ...Object.values(DEFAULT_FOOTER_MENU_NAME),
  ];

  // Go through both header and footer menus in all languages
  for (const menuId of menuIds) {
    const { data: navigationData } = await cmsClient.query<
      MenuQuery,
      MenuQueryVariables
    >({
      query: MenuDocument,
      variables: {
        id: menuId,
        menuIdentifiersOnly: false,
      },
      fetchPolicy: 'no-cache',
    });

    const nodes = navigationData.menu?.menuItems?.nodes?.map(
      (menuItem) => menuItem?.connectedNode?.node
    );

    // Get pages from the menu and their translations
    const pageInfos = nodes?.map(getPageInfosFromNode).flat() ?? [];

    for (const pageInfo of pageInfos) {
      slugToPageInfo[pageInfo.slug] = pageInfo;
    }
  }

  // Return unique pages ordered by slug for predictability
  return (
    Object.keys(slugToPageInfo)
      // Use localeCompare because of sonarcloud's typescript:S2871
      // ("Provide a compare function that depends on String.localeCompare,
      // to reliably sort elements alphabetically").
      .sort((a, b) => a.localeCompare(b))
      .map((key) => slugToPageInfo[key])
  );
};

/**
 * Generates the correct internal href based on the link and its module item type.
 * It uses specific path generation functions for articles and pages.
 *
 * @param link The target link string.
 * @param type The module item type (e.g., Article, Page).
 * @returns The resolved internal href, or '#' if the link is undefined and not an article or page.
 */
export function getRoutedInternalHref(
  link: string | null | undefined,
  type?: ModuleItemTypeEnum
): string {
  if (type === ModuleItemTypeEnum.Article) {
    return getCmsArticlePath(link);
  }
  if (type === ModuleItemTypeEnum.Page) {
    return getCmsPagePath(link);
  }
  return link ?? '#';
}

/**
 * Recursively rewrites internal URLs within an Apollo response data object based on
 * the URLRewriteMapping in the application configuration. It iterates through the
 * object's properties and replaces any string values that match a defined regex
 * with the corresponding replacement.
 *
 * @param apolloResponseData The Apollo fetch result in JSON format.
 * @returns A new JSON object with internal URLs rewritten according to the configuration.
 */
export function rewriteInternalURLs(
  apolloResponseData: Record<string, unknown>
): Record<string, unknown> {
  const replacer = (key: string, value: unknown) => {
    if (typeof value === 'string') {
      for (const { regex, replace, skip } of AppConfig.URLRewriteMapping) {
        const re = new RegExp(regex, 'g');
        if (re.test(value)) {
          if (skip) {
            return value;
          }
          return value.replace(re, replace);
        }
      }
    }
    return value;
  };
  return JSON.parse(JSON.stringify(apolloResponseData, replacer));
}

/**
 * An array of known non-CMS page paths (without trailing slashes).
 */
const KNOWN_NON_CMS_PAGES = [
  '', // root without slash
  '/search',
  '/newsletter',
];

/**
 * Determines if a given link corresponds to an internal CMS page.
 * It checks if the link, after removing the locale prefix and any trailing slash,
 * is NOT included in the `KNOWN_NON_CMS_PAGES` array.
 *
 * @param link The link string to check (can be null or undefined).
 * @returns True if the link is likely an internal CMS page, false otherwise.
 */
export const isInternalHrefCmsPage = (link?: string | null) => {
  const linkWithoutLocale = removeTrailingSlash(stripLocaleFromUri(link ?? ''));
  return !KNOWN_NON_CMS_PAGES.includes(linkWithoutLocale);
};

/**
 * Generates a routed internal href for a specific locale.
 * For CMS pages, it uses `getCmsPagePath` to ensure the correct CMS path.
 * For non-CMS pages, it returns the link without the original locale.
 *
 * @param locale The target locale ('fi', 'sv', or 'en').
 * @param link The original link string (can be null or undefined).
 * @returns The routed internal href for the given locale.
 * Returns '/' if the resolved link is empty.
 */
export const getRoutedInternalHrefForLocale = (
  locale: Language,
  link?: string | null
) => {
  // menu nav items, not breadcrumb
  const localePath = locale !== 'fi' ? `/${locale}` : '';
  const linkWithoutLocale = stripLocaleFromUri(link ?? '');
  const resolvedLink = isInternalHrefCmsPage(link)
    ? getCmsPagePath(linkWithoutLocale)
    : linkWithoutLocale;
  return removeTrailingSlash(`${localePath}${resolvedLink}`).replace(/^$/, '/'); // "" -> "/"
};

/**
 * Checks if a given menu item is currently active based on the browser's location.
 * It constructs the expected target path for the menu item in the specified locale
 * and compares it (case-insensitively) with the current window's pathname.
 *
 * @param menuItem The menu item object, which should have a 'path' property.
 * @param locale The current locale string (e.g., 'fi', 'sv', 'en').
 * @returns True if the menu item's target path matches the beginning of the current URL, false otherwise.
 */
export const getIsItemActive = (
  menuItem: MenuItem,
  locale: string
): boolean => {
  const localePath =
    locale !== LanguageCodeEnum.Fi.toLowerCase()
      ? `/${locale.toLowerCase()}`
      : '';

  const target = `${localePath}${getCmsPagePath(
    stripLocaleFromUri(menuItem.path ?? '')
  )}`.replace(/\/$/, '');
  return (
    typeof window !== 'undefined' && window.location.pathname.includes(target)
  );
};

/**
 * Generates a localized URL for a CMS item.
 * It constructs the URL by combining the specified language prefix with the pathname and query parameters.
 *
 * @param pathname The base path of the CMS item.
 * @param query The parsed URL query parameters.
 * @param language The target language code (e.g., 'FI', 'SV', 'EN').
 * @returns The fully localized URL in lowercase.
 */
// NOTE: `getLocalizedCmsItemUrl` could be renmaed to be more generic,
// but is left as it is, while it's only used in CMS context.
// It's easier to deprecate and easier to reuse when the context is clear.
export const getLocalizedCmsItemUrl = (
  pathname: string,
  query: ParsedUrlQuery,
  language: LanguageCodeEnum
): string => {
  const path = `/${language}`;
  return `${path}${stringifyUrlObject({
    query: query,
    pathname,
  })}`.toLowerCase();
};

/**
 * Retrieves the localized CMS href for a given language based on the provided language options.
 * It searches for the language option matching the specified language and constructs the CMS URL.
 * If no translation is found for the language, it returns the root path for that language.
 *
 * @param language The target language code (e.g., 'FI', 'SV', 'EN').
 * @param languageOptions An array of language options, each containing a URI and a locale.
 * @returns The localized CMS href in lowercase.
 */
export const getCmsHref = (
  language: LanguageCodeEnum,
  languageOptions: {
    uri: string | null | undefined;
    locale: string | undefined;
  }[]
) => {
  const nav = languageOptions?.find((languageOption) => {
    return languageOption.locale?.toLowerCase() === language.toLowerCase();
  });
  // if no translated url found, redirect to root
  if (!nav) {
    return `/${language}`.toLowerCase();
  }
  return `/${language}${getCmsPagePath(stripLocaleFromUri(nav?.uri ?? ''))}`.toLowerCase();
};

/**
 * Generates the target URL for the current non-CMS page in the specified language.
 * It reuses the `getLocalizedCmsItemUrl` function as the URL structure is the same for non-CMS pages.
 *
 * @param pathname The current pathname of the non-CMS page.
 * @param query The parsed URL query parameters.
 * @param language The target language code (e.g., 'FI', 'SV', 'EN').
 * @returns The localized URL for the non-CMS page in lowercase.
 */
export const getHrefForNonCmsPage = (
  pathname: string,
  query: ParsedUrlQuery,
  language: LanguageCodeEnum
): string => {
  return getLocalizedCmsItemUrl(pathname, query, language).toLowerCase();
};
