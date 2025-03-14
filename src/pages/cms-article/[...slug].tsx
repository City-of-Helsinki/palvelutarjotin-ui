/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { BreadcrumbListItem } from 'hds-react';
import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import {
  getCollections,
  CollectionType,
  GeneralCollectionType,
} from 'react-helsinki-headless-cms';

import { SUPPORTED_LANGUAGES } from '../../constants';
import { CommonApolloQueriesService } from '../../domain/app/ssr/commonApolloQueriesService';
import {
  addCmsApolloState,
  initializeCMSApolloClient,
} from '../../domain/headless-cms/apollo/apolloClient';
import CmsArticle from '../../domain/headless-cms/components/CmsArticle';
import { getUriID } from '../../domain/headless-cms/utils';
import {
  PostFieldsFragment,
  ArticleQuery,
  ArticleDocument,
  ArticleQueryVariables,
} from '../../generated/graphql-cms';
import { CustomPageProps, Language } from '../../types';
import getLocalizationProps from '../../utils/getLocalizationProps';

const NextCmsArticle: NextPage<{
  article: PostFieldsFragment;
  breadcrumbs: BreadcrumbListItem[];
  collections?: GeneralCollectionType[];
}> = (props) => <CmsArticle {...props} />;

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

type ResultProps =
  | ({
      article: PostFieldsFragment;
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
  // eslint-disable-next-line no-console
  console.debug(
    'Executing getStaticProps of an CMS article',
    '/pages/cms-article/[...slug].tsx',
    { params: context.params }
  );
  try {
    const {
      currentArticle: article,
      breadcrumbs,
      cmsClient,
    } = await getProps(context);

    if (!article) {
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
          article,
          breadcrumbs,
          collections: getCollections(article.modules ?? []),
        },
      }),
      revalidate: 60 * 60, // Once in an hour
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(
      'Error while generating article content page',
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

  // Fetch menu data to cache for the components so they can be rendered in the server
  const commonApolloQueriesService = new CommonApolloQueriesService({
    cmsApolloClient: cmsClient,
  });
  await commonApolloQueriesService.queryCmsHeaderMenu({
    language: (context.locale as SUPPORTED_LANGUAGES) ?? SUPPORTED_LANGUAGES.FI,
  });
  await commonApolloQueriesService.queryCmsFooterMenu({
    language: (context.locale as SUPPORTED_LANGUAGES) ?? SUPPORTED_LANGUAGES.FI,
  });

  const { data: articleData } = await cmsClient.query<
    ArticleQuery,
    ArticleQueryVariables
  >({
    query: ArticleDocument,
    variables: {
      id: getUriID(
        context.params?.slug as string[],
        context.locale as Language
      ),
      //   idType: PageIdType.Uri,
    },
  });

  const currentArticle = articleData.post;

  return { currentArticle, breadcrumbs: [], cmsClient };
};

export default NextCmsArticle;
