/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { NormalizedCacheObject } from '@apollo/client';
import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React from 'react';

import { ALL_I18N_NAMESPACES, SUPPORTED_LANGUAGES } from '../../constants';
import {
  LanguageCodeEnum,
  MenuNodeIdTypeEnum,
  PageDocument,
  PageQuery,
  PageQueryVariables,
  MenuDocument,
  MenuQuery,
  MenuQueryVariables,
  PageIdType,
  Page,
  usePageQuery,
} from '../../generated/graphql-cms';
import { createCmsApolloClient } from '../../headless-cms/cmsApolloClient';
import { useCMSClient } from '../../headless-cms/cmsApolloContext';
import CmsPageContent, {
  getUriID,
} from '../../headless-cms/components/CmsPageContent';
import { MENU_NAME } from '../../headless-cms/constants';
import useLocale from '../../hooks/useLocale';
import { Language } from '../../types';

const CmsPage: NextPage = () => {
  const {
    query: { pageId },
  } = useRouter();
  const locale = useLocale();
  const cmsClient = useCMSClient();

  const { data: pageData } = usePageQuery({
    client: cmsClient,
    variables: {
      id: getUriID(pageId as string, locale),
      idType: PageIdType.Uri,
    },
  });

  return (
    <div>
      <CmsPageContent page={pageData?.page as Page} />;
    </div>
  );
};

export async function getStaticPaths() {
  const cmsClient = createCmsApolloClient();

  // Fetch menus for all the supported languages
  const menuQueries = Object.values(SUPPORTED_LANGUAGES).map(async (locale) => {
    const { data } = await cmsClient.query<MenuQuery, MenuQueryVariables>({
      query: MenuDocument,
      variables: {
        id: MENU_NAME.Header,
        idType: MenuNodeIdTypeEnum.Name,
      },
    });
    return { data, locale };
  });
  const menus = await Promise.all(menuQueries);

  // Form paths array to render static pages from:
  // [{ params: { pageId: 'pageId' }, locale: 'fi|en|sv' }, ...]
  const paths = menus
    .flatMap((menu) => {
      return menu.data.menu?.menuItems?.nodes?.map((menuItem) => {
        // Seems like slug can be undefined so we filter those out
        if ((menuItem?.connectedNode?.node as Page)?.translation?.slug) {
          return {
            params: {
              pageId: (menuItem?.connectedNode?.node as Page)?.translation
                ?.slug,
            },
            locale: menu.locale,
          };
        }
        return null;
      });
    })
    .filter((i) => i);

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<
  GetStaticPropsResult<{ initialApolloState: NormalizedCacheObject }>
> {
  const cmsClient = createCmsApolloClient();

  // Fetch menu and cms page data to cache for the components so they can be rendered in the server
  await Promise.all([
    cmsClient.query<PageQuery, PageQueryVariables>({
      query: PageDocument,
      variables: {
        id: getUriID(
          context.params?.pageId as string,
          context.locale as Language
        ),
        idType: PageIdType.Uri,
      },
    }),
    cmsClient.query<MenuQuery, MenuQueryVariables>({
      query: MenuDocument,
      variables: {
        id: MENU_NAME.Header,
        idType: MenuNodeIdTypeEnum.Name,
      },
    }),
  ]);

  return {
    props: {
      initialApolloState: cmsClient.cache.extract(),
      ...(await serverSideTranslations(
        context.locale as string,
        ALL_I18N_NAMESPACES
      )),
    },
    revalidate: 60,
  };
}

export default CmsPage;
