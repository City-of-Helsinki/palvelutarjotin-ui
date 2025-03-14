import { BreadcrumbListItem } from 'hds-react';
import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import dynamic from 'next/dynamic';
import {
  getCollections,
  CollectionType,
  GeneralCollectionType,
} from 'react-helsinki-headless-cms';
import {
  MenuDocument,
  MenuQuery,
  MenuQueryVariables,
} from 'react-helsinki-headless-cms/apollo';

import { DEFAULT_HEADER_MENU_NAME, SUPPORTED_LANGUAGES } from '../../constants';
import {
  addCmsApolloState,
  initializeCMSApolloClient,
} from '../../domain/headless-cms/apollo/apolloClient';
import {
  getAllMenuPages,
  getSlugFromUri,
  getUriID,
  slugsToUriSegments,
} from '../../domain/headless-cms/utils';
import {
  PageDocument,
  PageQuery,
  PageQueryVariables,
  PageIdType,
  PageFieldsFragment,
  Page,
} from '../../generated/graphql-cms';
import { CustomPageProps, Language } from '../../types';
import { isFeatureEnabled } from '../../utils/featureFlags';
import getLocalizationProps from '../../utils/getLocalizationProps';

// TODO: The Dynamic CMS Page should be statically rendered.
// A revalidation should be called from the CMS when an update is done.
// Also a nightly/daily cleaner should clear the stored pages.
const DynamicCmsPageWithNoSSR = dynamic(
  () => import('../../domain/headless-cms/components/CmsPage'),
  { ssr: false, loading: () => <div style={{ height: '100vh' }} /> }
);

const NextCmsPage: NextPage<{
  page: Page;
  breadcrumbs: BreadcrumbListItem[];
  collections?: GeneralCollectionType[];
}> = (props) => <DynamicCmsPageWithNoSSR {...props} />;

export async function getStaticPaths() {
  if (isFeatureEnabled('HEADLESS_CMS')) {
    if (process.env.SKIP_BUILD_STATIC_GENERATION === 'true') {
      // eslint-disable-next-line no-console
      console.info('Skipping static generation for cms pages.');
      return {
        paths: [],
        fallback: 'blocking',
      };
    }

    const pages = await getAllMenuPages();

    if (pages?.length) {
      // eslint-disable-next-line no-console
      console.info('Generating static cms pages.');
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
  }
  // eslint-disable-next-line no-console
  console.warn('No Headless CMS enabled.');
  return { paths: [], fallback: false };
}

type ResultProps =
  | ({
      page: PageFieldsFragment;
      breadcrumbs: BreadcrumbListItem[];
      collections?: CollectionType[];
    } & CustomPageProps)
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
      ...addCmsApolloState(cmsClient, {
        props: {
          ...getLocalizationProps(context.locale),
          initialCMSApolloState: null,
          initialApolloState: null,
          page,
          breadcrumbs,
          collections: getCollections(page.modules ?? []),
        },
      }),
      revalidate: 60 * 60, // Once in an hour
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(
      'Error while generating content page',
      { params: context.params },
      e
    );
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
  const cmsClient = initializeCMSApolloClient();

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
      id: DEFAULT_HEADER_MENU_NAME[
        (context.locale as SUPPORTED_LANGUAGES) ?? SUPPORTED_LANGUAGES.FI
      ],
      menuIdentifiersOnly: true,
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
    path: page?.link ?? '',
    title: page?.title ?? '',
  }));

  return { currentPage, breadcrumbs, cmsClient };
};

export default NextCmsPage;
