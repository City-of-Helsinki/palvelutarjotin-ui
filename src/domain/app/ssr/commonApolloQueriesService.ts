import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  ArticleType,
  PageType,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import {
  MenuDocument,
  MenuQuery,
  MenuQueryVariables,
  PagesDocument,
  PagesQuery,
  PagesQueryVariables,
  PostsDocument,
  PostsQuery,
  PostsQueryVariables,
} from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import {
  ARTICLES_AMOUNT_LIMIT as ALL_ARTICLES_AMOUNT_LIMIT,
  DEFAULT_MENU_NAME,
  PAGES_AMOUNT_LIMIT as ALL_PAGES_AMOUNT_LIMIT,
} from './constants';
import { MenuType, PageUriInfo } from './types';
import { SUPPORTED_LANGUAGES } from '../../../constants';

/**
 * Service class for executing common Apollo queries related to CMS data.
 *
 * NOTE: The queries need to match the real queries that are executed on the client side,
 * or the cache keys will not match (and therefore will not work as intended).
 */
export class CommonApolloQueriesService {
  /**
   * The CMS Apollo Client instance used for querying.
   */
  private cmsApolloClient: ApolloClient<NormalizedCacheObject>;

  /**
   * Constructs a new CommonApolloQueriesService instance.
   *
   * @param {Object} params - The parameters for the constructor.
   * @param {ApolloClient<NormalizedCacheObject>} params.cmsApolloClient - The CMS Apollo Client instance.
   */
  constructor({
    cmsApolloClient,
  }: {
    cmsApolloClient: ApolloClient<NormalizedCacheObject>;
  }) {
    this.cmsApolloClient = cmsApolloClient;
  }

  /**
   * Queries and caches the CMS menu data for one or all supported languages.
   *
   * @param {Object} params - The parameters for the query.
   * @param {SUPPORTED_LANGUAGES} [params.language] - Optional language for the menu.
   * If omitted, queries for all languages.
   * @param {MenuType} params.menuType - The type of menu to query.
   * @returns {Promise<void>} - A promise that resolves when all queries are complete.
   */
  async queryCmsMenu({
    language,
    menuType,
  }: {
    language?: SUPPORTED_LANGUAGES;
    menuType: MenuType;
  }): Promise<void> {
    const languages: SUPPORTED_LANGUAGES[] = language
      ? [language]
      : Object.values(SUPPORTED_LANGUAGES);

    for (const lang of languages) {
      const id = DEFAULT_MENU_NAME[menuType][lang];
      if (id) {
        try {
          await this.cmsApolloClient.query<MenuQuery, MenuQueryVariables>({
            query: MenuDocument,
            variables: {
              id,
              menuIdentifiersOnly: true,
            },
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error fetching ${menuType} menu for ${lang}:`, error);
          // Or throw the error, or handle it in another way.
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `Not fetching ${menuType} menu for ${lang} because its menu name was empty`
        );
      }
    }
  }

  /**
   * Retrieves and caches information about all pages from the CMS.
   *
   * @returns {Promise<PageUriInfo[]>} - A promise that resolves with an array of page URI information.
   */
  async getAllPages(): Promise<PageUriInfo[]> {
    const pageInfos: PageUriInfo[] = [];
    try {
      const { data: pagesData } = await this.cmsApolloClient.query<
        PagesQuery,
        PagesQueryVariables
      >({
        query: PagesDocument,
        variables: {
          first: ALL_PAGES_AMOUNT_LIMIT,
        },
      });
      pagesData.pages?.edges?.forEach((edge) =>
        this.addNodesToPageInfosArray(pageInfos, edge?.node as PageType)
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching pages:', error);
      throw error;
    }
    return pageInfos;
  }

  /**
   * Retrieves and caches information about all articles from the CMS.
   *
   * @returns {Promise<PageUriInfo[]>} - A promise that resolves with an array of article URI information.
   */
  async getAllArticles(): Promise<PageUriInfo[]> {
    const pageInfos: PageUriInfo[] = [];
    try {
      const { data: articlesData } = await this.cmsApolloClient.query<
        PostsQuery,
        PostsQueryVariables
      >({
        query: PostsDocument,
        variables: {
          first: ALL_ARTICLES_AMOUNT_LIMIT,
        },
      });
      articlesData.posts?.edges?.forEach((edge) =>
        this.addNodesToPageInfosArray(pageInfos, edge?.node as ArticleType)
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching articles:', error);
      throw error;
    }
    return pageInfos;
  }

  /**
   * Adds node information to the pageInfos array, including translations.
   *
   * @private
   * @param {PageUriInfo[]} pageInfos - The array to add page information to.
   * @param {PageType | ArticleType} node - The node containing page or article data.
   */
  private addNodesToPageInfosArray(
    pageInfos: PageUriInfo[],
    node: PageType | ArticleType
  ): void {
    if (node && node.uri && node.slug && node.language?.code) {
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
}
