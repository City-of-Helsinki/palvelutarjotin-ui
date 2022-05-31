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
  PostFieldsFragment,
  ArticleQuery,
  ArticleDocument,
  ArticleQueryVariables,
} from '../../generated/graphql-cms';
import { createCmsApolloClient } from '../../headless-cms/cmsApolloClient';
import CmsArticle from '../../headless-cms/components/CmsArticle';
import { getUriID } from '../../headless-cms/utils';
import { Language } from '../../types';

const NextCmsArticle: NextPage<{
  article: PostFieldsFragment;
  breadcrumbs: Breadcrumb[];
  collections?: CollectionType[];
}> = (props) => <CmsArticle {...props} />;

export async function getStaticPaths() {
  return { paths: [], fallback: false };
}

type ResultProps =
  | {
      initialApolloState: NormalizedCacheObject;
      article: PostFieldsFragment;
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
      props: {
        initialApolloState: cmsClient.cache.extract(),
        ...(await serverSideTranslations(
          context.locale as string,
          ALL_I18N_NAMESPACES
        )),
        article,
        breadcrumbs,
        collections: getCollections(article.modules ?? []),
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

  // Fetch menu data to cache for the components so they can be rendered in the server
  //   await cmsClient.query<MenuQuery, MenuQueryVariables>({
  //     query: MenuDocument,
  //     variables: {
  //       id: MENU_NAME.Header,
  //       idType: MenuNodeIdTypeEnum.Name,
  //     },
  //   });

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
