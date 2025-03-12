import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  MenuDocument,
  MenuQuery,
  MenuQueryVariables,
} from 'react-helsinki-headless-cms/apollo';

import {
  DEFAULT_HEADER_MENU_NAME,
  DEFAULT_FOOTER_MENU_NAME,
  SUPPORTED_LANGUAGES,
} from '../../../constants';

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
}
