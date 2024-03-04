import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import type { ArticleType, PageType } from 'react-helsinki-headless-cms';
import {
  PostsDocument,
  PagesDocument,
} from 'react-helsinki-headless-cms/apollo';
import type {
  PostsQuery,
  PostsQueryVariables,
  PagesQuery,
  PagesQueryVariables,
} from 'react-helsinki-headless-cms/apollo';
type PageInfo = { uri: string; slug: string; locale: string };

export const ARTICLES_AMOUNT_LIMIT = 100;
export const PAGES_AMOUNT_LIMIT = 100;

export const getAllArticles = async (
  apolloClient: ApolloClient<NormalizedCacheObject>
): Promise<PageInfo[]> => {
  const pageInfos: PageInfo[] = [];
  const { data: articlesData } = await apolloClient.query<
    PostsQuery,
    PostsQueryVariables
  >({
    query: PostsDocument,
    variables: {
      first: ARTICLES_AMOUNT_LIMIT,
    },
  });
  articlesData.posts?.edges?.forEach((edge) =>
    addArticleToPageInfosArray(edge?.node as ArticleType)
  );
  return pageInfos;

  function addArticleToPageInfosArray(node: ArticleType) {
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
};

export const getAllPages = async (
  apolloClient: ApolloClient<NormalizedCacheObject>
): Promise<PageInfo[]> => {
  const pageInfos: PageInfo[] = [];
  const { data: pagesData } = await apolloClient.query<
    PagesQuery,
    PagesQueryVariables
  >({
    query: PagesDocument,
    variables: {
      first: PAGES_AMOUNT_LIMIT,
    },
  });
  pagesData.pages?.edges?.forEach((edge) =>
    addPagesToPageInfosArray(edge?.node as PageType)
  );
  return pageInfos;

  function addPagesToPageInfosArray(node: PageType) {
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
};
