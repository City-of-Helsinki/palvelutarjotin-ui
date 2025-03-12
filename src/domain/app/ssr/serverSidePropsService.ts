import type { GetServerSidePropsContext, GetStaticPropsContext } from 'next';

import { CommonApolloQueriesService } from './commonApolloQueriesService';
import { SUPPORTED_LANGUAGES } from '../../../constants';
import getLocalizationProps from '../../../utils/getLocalizationProps';
import {
  addCmsApolloState,
  initializeCMSApolloClient,
} from '../../headless-cms/apollo/apolloClient';

/**
 * Service class for fetching and caching common props for server-side rendering (SSR) or static site generation (SSG).
 *
 * This class handles fetching data like menu data and localization props, and it prepares the data for
 * static site generation (SSG) or server-side rendering (SSR) in Next.js.
 */
export class CommonPropsService {
  /**
   * Caches CMS menu queries for header and footer menus.
   *
   * This method fetches and caches the header and footer menu data using the provided CMS Apollo Client.
   * It handles different languages based on the locale.
   */
  static async cacheCMSMenuQueries({
    cmsApolloClient,
    locale,
  }: {
    cmsApolloClient: ReturnType<typeof initializeCMSApolloClient>;
    locale:
      | GetStaticPropsContext['locale']
      | GetServerSidePropsContext['locale'];
  }): Promise<void> {
    const language: SUPPORTED_LANGUAGES =
      (locale as SUPPORTED_LANGUAGES) ?? SUPPORTED_LANGUAGES.FI;
    const apolloQueryService = new CommonApolloQueriesService({
      cmsApolloClient,
    });
    await apolloQueryService.queryCmsHeaderMenu({ language });
    await apolloQueryService.queryCmsFooterMenu({ language });
  }

  /**
   * Retrieves common props for SSR or SSG rendering.
   *
   * This method fetches the following props:
   *
   * -   **Header Menu Data:** Fetches and caches the data for the header menu.
   * -   **Footer Menu Data:** Fetches and caches the data for the footer menu.
   * -   **Localization Props:** Retrieves localization props based on the provided locale.
   * -   **CMS Apollo Client State:** Extracts and adds the CMS Apollo Client's cache state
   * to the `pageProps` for client-side hydration.
   *
   * If any errors occur during data fetching, it gracefully returns localization props only.
   *
   * @example
   * ```typescript
   * export const getStaticProps: GetStaticProps = async (context) => {
   * return CommonPropsService.getCommonStaticProps(context);
   * };
   *
   * export const getServerSideProps: GetServerSideProps = async (context) => {
   * return CommonPropsService.getCommonStaticProps(context);
   * };
   * ```
   */
  static async getCommonStaticProps({
    locale,
  }: GetStaticPropsContext | GetServerSidePropsContext): Promise<{
    props: any;
  }> {
    const cmsApolloClient = initializeCMSApolloClient();
    try {
      await this.cacheCMSMenuQueries({ cmsApolloClient, locale });

      return addCmsApolloState(cmsApolloClient, {
        props: {
          ...getLocalizationProps(locale),
          initialApolloState: null,
          initialCMSApolloState: null,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching menu data:', error);
      return {
        props: {
          ...getLocalizationProps(locale),
        },
      };
    }
  }
}
