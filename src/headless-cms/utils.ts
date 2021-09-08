import {
  MenuDocument,
  MenuNodeIdTypeEnum,
  MenuQuery,
  MenuQueryVariables,
  Page,
  PageDocument,
  PageIdType,
  PageQuery,
  PageQueryVariables,
} from '../generated/graphql-cms';
import { Language } from '../types';
import { createCmsApolloClient } from './cmsApolloClient';
import { MENU_NAME } from './constants';

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
  // get url breadcrumbs with positive lookbehind pattern
  const breadcrums = uri.matchAll(/(?<=(\/(?:[a-z0-9]|-|\/)+\/))/g);
  return Array.from(breadcrums).map((match) => match[1]);
};

export const slugsToUriSegments = (slugs: string[]): string[] => {
  return slugs.map((slug, index) => {
    return `/${slugs.slice(0, index + 1).join('/')}/`;
  });
};

type PageInfo = { uri: string; slug: string; locale: string };

// Recursively go through all child pages from menu query
// and return
export const getAllMenuPages = async (): Promise<PageInfo[]> => {
  const pageInfos: PageInfo[] = [];
  const cmsClient = createCmsApolloClient();
  const { data: navigationData } = await cmsClient.query<
    MenuQuery,
    MenuQueryVariables
  >({
    query: MenuDocument,
    variables: {
      id: MENU_NAME.Header,
      idType: MenuNodeIdTypeEnum.Name,
    },
  });

  const menuItemPromises = navigationData.menu?.menuItems?.nodes?.map(
    (menuItem) => getPageChildren(menuItem?.connectedNode?.node as Page)
  );

  if (menuItemPromises) {
    await Promise.all(menuItemPromises);
  }

  return pageInfos;

  async function getPageChildren(node: Page): Promise<unknown> {
    addPageToPageInfosArray(node);
    if (node.children?.nodes) {
      return Promise.all(
        node.children.nodes.map(async (page) => {
          if (page?.id) {
            const { data: childPage } = await cmsClient.query<
              PageQuery,
              PageQueryVariables
            >({
              query: PageDocument,
              variables: {
                id: page.id,
                idType: PageIdType.Id,
              },
            });
            return getPageChildren(childPage.page as Page);
          }
        })
      );
    }
  }

  function addPageToPageInfosArray(node: Page) {
    if (node.uri && node.slug && node.language?.code) {
      pageInfos.push({
        uri: node.uri,
        locale: node.language.code.toLowerCase(),
        slug: node.slug,
      });
      node.translations?.forEach((translation) => {
        if (
          translation?.uri &&
          translation.slug &&
          translation.language?.code
        ) {
          const {
            uri,
            slug,
            language: { code },
          } = translation;
          pageInfos.push({
            uri,
            slug,
            locale: code.toLocaleLowerCase(),
          });
        }
      });
    }
  }
};
