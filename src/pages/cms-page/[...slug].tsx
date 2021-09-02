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
} from '../../generated/graphql-cms';
import { createCmsApolloClient } from '../../headless-cms/cmsApolloClient';
import CmsPage, { getUriID } from '../../headless-cms/components/CmsPage';
import { MENU_NAME } from '../../headless-cms/constants';
import { Language } from '../../types';
import { isFeatureEnabled } from '../../utils/featureFlags';

const NextCmsPage: NextPage = () => <CmsPage />;

export async function getStaticPaths() {
  const cmsClient = createCmsApolloClient();

  // Fetch menus for all the supported languages
  const { data: navigationData } = await cmsClient.query<
    MenuQuery,
    MenuQueryVariables
  >({
    query: MenuDocument,
    variables: {
      id: MENU_NAME.Header,
      idType: MenuNodeIdTypeEnum.Name,
    },
  });

  // contains menu items as arrays with all the translations
  const menuItems = navigationData?.menu?.menuItems?.nodes?.flatMap(
    (menuItem) => {
      const item = menuItem?.connectedNode?.node;
      if (item && 'title' in item) {
        const childItems = item.children?.nodes?.map((node) => {
          if (node && 'uri' in node) {
            return {
              ...node,
              locale: node.language?.code?.toLocaleLowerCase(),
            };
          }
          return null;
        });

        const translationItems = item.translations?.map((translation) => ({
          ...translation,
          locale: translation?.language?.code,
        }));

        const childTranslationItems = item.translations?.flatMap(
          (translation) => {
            return translation?.children?.nodes?.map((node) => {
              if (node && 'uri' in node) {
                return {
                  ...node,
                  locale: node.language?.code?.toLowerCase(),
                };
              }
              return null;
            });
          }
        );

        return [
          {
            ...item,
            locale: item?.language?.code,
          },
          ...(childTranslationItems ?? []),
          ...(childItems ?? []),
          ...(translationItems ?? []),
        ];
      }

      return null;
    }
  );

  const getSlugFromUri = (uri?: string | null) => {
    const uriWithoutLang = uri?.replace('/en', '')?.replace('/sv', '');
    if (uriWithoutLang) {
      return uriWithoutLang.split('/').filter((i) => i);
    }
  };

  if (isFeatureEnabled('HEADLESS_CMS')) {
    return {
      paths: menuItems
        ?.filter((i) => i?.uri)
        .map((item) => ({
          params: { slug: getSlugFromUri(item?.uri) },
          locale: item?.locale?.toLowerCase(),
        })),
      fallback: true,
    };
  }

  return { paths: [], fallback: false };
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
          context.params?.slug as string[],
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

export default NextCmsPage;
