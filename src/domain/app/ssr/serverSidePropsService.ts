import type { GetServerSidePropsContext, GetStaticPropsContext } from 'next';

import { CommonApolloQueriesService } from './commonApolloQueriesService';
import { isSupportedLanguage } from './types';
import { DEFAULT_LANGUAGE } from '../../../constants';
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
    // NOTE: When NextJS goes throught the getStaticProps, the locale can be e.g. any of the following:
    // default, fi, en, sv, cimode...
    // The default-locale will be rewritten and the cimode might not have a menu.
    const language = isSupportedLanguage(locale) ? locale : DEFAULT_LANGUAGE;

    const apolloQueryService = new CommonApolloQueriesService({
      cmsApolloClient,
    });

    await apolloQueryService.queryCmsMenu({ language, menuType: 'header' });
    await apolloQueryService.queryCmsMenu({ language, menuType: 'footer' });
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: any;
  }> {
    const cmsApolloClient = initializeCMSApolloClient();
    try {
      await this.cacheCMSMenuQueries({ cmsApolloClient, locale });

      return addCmsApolloState(cmsApolloClient, {
        props: {
          ...(await getLocalizationProps(locale)),
          initialApolloState: null,
          initialCMSApolloState: null,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching menu data:', error);
      return {
        props: {
          ...(await getLocalizationProps(locale)),
        },
      };
    }
  }
}
