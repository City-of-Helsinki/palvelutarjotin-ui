import {
  ModuleItemTypeEnum,
  LanguageCodeEnum,
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
import { getCmsArticlePath, getCmsPagePath } from '../app/routes/utils';

export const getUriID = (slugs: string[], locale: Language): string => {
  if (!slugs) return '/';
  if (locale === 'fi') {
    return `/${slugs.join('/')}/`;
  }
  return `/${locale}/${slugs.join('/')}/`;
};

export const getSlugFromUri = (uri?: string | null): string[] | null => {
  const uriWithoutLang = stripLocaleFromUri(uri ?? '');
  if (uriWithoutLang) {
    return uriWithoutLang.split('/').filter((i) => i);
  }
  return null;
};

export const stripLocaleFromUri = (uri: string): string => {
  return uri.replace(/^\/(en|sv|fi)(?![a-z0-9])/i, '');
};

export const removeTrailingSlash = (uri: string): string => {
  return uri.replace(/\/$/, '');
};

// '/segment1/segment2/' -> ['/segment1/', '/segment1/segment2/']
// current implementation required both leading and trailing slashes
// to include all breadcrumbs
export const uriToBreadcrumbs = (uri: string): string[] => {
  return slugsToUriSegments(
    stripLocaleFromUri(uri)
      .split('/')
      // Filter out empty strings
      .filter((i) => i)
  );
};

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

/** Is node from MenuQuery a valid Page object? */
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

/** Convert a valid Page object to PageInfo. */
const nodeToPageInfo = (node: ValidPage): PageInfo => {
  return {
    uri: node.uri,
    slug: node.slug,
    locale: LANGUAGE_CODE_ENUM_TO_LANGUAGE[node.language.code],
  };
};

/** Get all PageInfo objects from a Page and its translations recursively. */
const getPageInfosFromNode = (node: unknown): PageInfo[] => {
  const result: PageInfo[] = [];
  if (isValidPage(node)) {
    result.push(nodeToPageInfo(node));
    if ('translations' in node && Array.isArray(node.translations)) {
      for (const translatedNode of node.translations) {
        result.concat(getPageInfosFromNode(translatedNode));
      }
    }
  }
  return result;
};

/** Get all unique menu pages from headless CMS for all languages. */
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
 * Rewrite the URLs with internal URLS.
 * @param apolloResponseData The fetch result in JSON format
 * @returns A JSON with manipulated content transformed with URLRewriteMapping
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

/** Known non-CMS pages without trailing slash. */
const KNOWN_NON_CMS_PAGES = [
  '', // root without slash
  '/search',
  '/newsletter',
];

export const isInternalHrefCmsPage = (link?: string | null) => {
  const linkWithoutLocale = removeTrailingSlash(stripLocaleFromUri(link ?? ''));
  return !KNOWN_NON_CMS_PAGES.includes(linkWithoutLocale);
};

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
