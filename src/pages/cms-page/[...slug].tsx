/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { NormalizedCacheObject } from '@apollo/client';
import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Breadcrumb,
  getCollections,
  CollectionType,
} from 'react-helsinki-headless-cms';

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
} from '../../headless-cms/utils';
import { Language } from '../../types';
import { isFeatureEnabled } from '../../utils/featureFlags';

const NextCmsPage: NextPage<{
  page: PageFieldsFragment;
  breadcrumbs: Breadcrumb[];
  collections?: CollectionType[];
}> = (props) => <CmsPage {...props} />;

export async function getStaticPaths() {
  const pages = await getAllMenuPages();

  if (isFeatureEnabled('HEADLESS_CMS') && pages) {
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

type ResultProps =
  | {
      initialApolloState: NormalizedCacheObject;
      page: PageFieldsFragment;
      breadcrumbs: Breadcrumb[];
      collections?: CollectionType[];
    }
  | {
      error?: {
        statusCode: number;
      };
    };

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<ResultProps>> {
  try {
    const {
      currentPage: page,
      breadcrumbs,
      cmsClient,
    } = await getProps(context);

    if (!page) {
      return {
        notFound: true,
        revalidate: true,
      };
    }

    return {
      props: {
        initialApolloState: cmsClient.cache.extract(),
        ...(await serverSideTranslations(
          context.locale as string,
          ALL_I18N_NAMESPACES
        )),
        page,
        breadcrumbs,
        collections: getCollections(page.modules ?? []),
      },
      revalidate: 60,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Error while generating content page', e);
    return {
      props: {
        error: {
          statusCode: 400,
        },
      },
      revalidate: 10,
    };
  }
}

const getProps = async (context: GetStaticPropsContext) => {
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

  const breadcrumbs = pages.map((page) => ({
    link: page?.link ?? '',
    title: page?.title ?? '',
  }));

  return { currentPage, breadcrumbs, cmsClient };
};

export default NextCmsPage;
