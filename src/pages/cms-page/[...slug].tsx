/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { NormalizedCacheObject } from '@apollo/client';
import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ALL_I18N_NAMESPACES } from '../../constants';
import {
  MenuNodeIdTypeEnum,
  PageDocument,
  PageQuery,
  PageQueryVariables,
  MenuDocument,
  MenuQuery,
  MenuQueryVariables,
  PageIdType,
  PageFieldsFragment,
} from '../../generated/graphql-cms';
import { createCmsApolloClient } from '../../headless-cms/cmsApolloClient';
import CmsPage from '../../headless-cms/components/CmsPage';
import { MENU_NAME } from '../../headless-cms/constants';
import {
  getAllMenuPages,
  getSlugFromUri,
  getUriID,
  slugsToUriSegments,
  stripLocaleFromUri,
} from '../../headless-cms/utils';
import { Language } from '../../types';
import { isFeatureEnabled } from '../../utils/featureFlags';

export type NavigationObject = {
  uri: string;
  locale: string;
  title: string;
};

const NextCmsPage: NextPage<{
  navigation: NavigationObject[][];
  page: PageFieldsFragment;
}> = (props) => <CmsPage {...props} />;

export async function getStaticPaths() {
  const pages = await getAllMenuPages();

  if (isFeatureEnabled('HEADLESS_CMS')) {
    return {
      paths: pages.map((page) => {
        return {
          params: {
            slug: getSlugFromUri(page.uri),
          },
          locale: page.locale,
        };
      }),
      fallback: true,
    };
  }

  return { paths: [], fallback: false };
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<
  GetStaticPropsResult<{
    initialApolloState: NormalizedCacheObject;
    navigation: NavigationObject[][];
    page: PageFieldsFragment;
  }>
> {
  const cmsClient = createCmsApolloClient();

  // These breadcrumb uris are used to fetch all the parent pages of the current page
  // so that all the childrens of parent page can be figured out and sub page navigations can be formed
  // for rendering
  const uriSegments = slugsToUriSegments(
    (context.params?.slug ?? []) as string[]
  );

  // Fetch menu data to cache for the components so they can be rendered in the server
  await cmsClient.query<MenuQuery, MenuQueryVariables>({
    query: MenuDocument,
    variables: {
      id: MENU_NAME.Header,
      idType: MenuNodeIdTypeEnum.Name,
    },
  });

  const { data: pageData } = await cmsClient.query<
    PageQuery,
    PageQueryVariables
  >({
    query: PageDocument,
    variables: {
      id: getUriID(
        context.params?.slug as string[],
        context.locale as Language
      ),
      idType: PageIdType.Uri,
    },
  });

  // Fetch all parent pages for navigation data
  const apolloPageResponses = await Promise.all(
    uriSegments.map((uri) => {
      return cmsClient.query<PageQuery, PageQueryVariables>({
        query: PageDocument,
        variables: {
          id: uri,
          idType: PageIdType.Uri,
        },
      });
    })
  );

  const pages = apolloPageResponses.map((res) => res.data.page);
  const currentPage = pageData.page;

  // Form array of navigation arrays of all the sub menus of current cms page
  const navigationArrays = pages
    .map((page) => {
      const navigationItems: NavigationObject[] = [];
      page?.children?.nodes?.forEach((p) => {
        if (p && 'uri' in p) {
          navigationItems.push({
            uri: stripLocaleFromUri(p.uri ?? '') as string,
            locale: p.language?.code?.toLowerCase() ?? 'fi',
            title: p.title ?? '',
          });
        }
      });
      return navigationItems;
    })
    .filter((i) => !!i.length);

  if (!currentPage) {
    throw new Error('Page undefined!');
  }

  return {
    props: {
      initialApolloState: cmsClient.cache.extract(),
      ...(await serverSideTranslations(
        context.locale as string,
        ALL_I18N_NAMESPACES
      )),
      navigation: navigationArrays,
      page: currentPage,
    },
    revalidate: 60,
  };
}

export default NextCmsPage;
