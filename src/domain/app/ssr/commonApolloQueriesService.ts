import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { ArticleType, PageType } from 'react-helsinki-headless-cms';
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
} from 'react-helsinki-headless-cms/apollo';

import { PageUriInfo } from './types';
import {
  DEFAULT_HEADER_MENU_NAME,
  DEFAULT_FOOTER_MENU_NAME,
  SUPPORTED_LANGUAGES,
} from '../../../constants';

export const ARTICLES_AMOUNT_LIMIT = 100;
export const PAGES_AMOUNT_LIMIT = 100;

/**
 * Service class for executing Apollo queries related to CMS data.
 *
 * NOTE: The queries needs to match the real queries that are executed on client side,
 * or the cache key does not match (and there fore does not work as intended).
 */
export class CommonApolloQueriesService {
  /**
   * The CMS Apollo Client instance.
   */
  private cmsApolloClient: ApolloClient<NormalizedCacheObject>;

  constructor({
    cmsApolloClient,
  }: {
    cmsApolloClient: ApolloClient<NormalizedCacheObject>;
  }) {
    this.cmsApolloClient = cmsApolloClient;
  }

  /**
   * Queries and caches the CMS header menu data.
   */
  async queryCmsHeaderMenu({
    language,
  }: {
    language: SUPPORTED_LANGUAGES;
  }): Promise<void> {
    await this.cmsApolloClient.query<MenuQuery, MenuQueryVariables>({
      query: MenuDocument,
      variables: {
        id: DEFAULT_HEADER_MENU_NAME[language],
        menuIdentifiersOnly: true,
      },
    });
  }

  /**
   * Queries and caches the CMS footer menu data.
   */
  async queryCmsFooterMenu({
    language,
  }: {
    language: SUPPORTED_LANGUAGES;
  }): Promise<void> {
    // FIXME: For some reason this causes a hydration issue (easily reproducable in dev mode)
    await this.cmsApolloClient.query<MenuQuery, MenuQueryVariables>({
      query: MenuDocument,
      variables: {
        id: DEFAULT_FOOTER_MENU_NAME[language],
        menuIdentifiersOnly: true,
      },
    });
  }

  async getAllPages(): Promise<PageUriInfo[]> {
    const pageInfos: PageUriInfo[] = [];
    const { data: pagesData } = await this.cmsApolloClient.query<
      PagesQuery,
      PagesQueryVariables
    >({
      query: PagesDocument,
      variables: {
        first: PAGES_AMOUNT_LIMIT,
      },
    });
    pagesData.pages?.edges?.forEach((edge) =>
      this.addNodesToPageInfosArray(pageInfos, edge?.node as PageType)
    );
    return pageInfos;
  }

  async getAllArticles(): Promise<PageUriInfo[]> {
    const pageInfos: PageUriInfo[] = [];
    const { data: articlesData } = await this.cmsApolloClient.query<
      PostsQuery,
      PostsQueryVariables
    >({
      query: PostsDocument,
      variables: {
        first: ARTICLES_AMOUNT_LIMIT,
      },
    });
    articlesData.posts?.edges?.forEach((edge) =>
      this.addNodesToPageInfosArray(pageInfos, edge?.node as ArticleType)
    );
    return pageInfos;
  }

  private addNodesToPageInfosArray(
    pageInfos: PageUriInfo[],
    node: PageType | ArticleType
  ) {
    if (node && node.uri && node.slug && node.language?.code) {
      pageInfos.push({
        uri: node.uri,
        locale: node.language.code.toLowerCase(),
        slug: node.slug,
      });
      // NOTE: HCRC-build sometimes fails - this type should not be needed.
      // : PageType['translations']
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
