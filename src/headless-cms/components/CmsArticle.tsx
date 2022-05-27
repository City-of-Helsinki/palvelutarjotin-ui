import { useTranslation } from 'next-i18next';
import React from 'react';
import {
  PageContent as RHHCPageContent,
  PageContentProps,
  Breadcrumb,
  Collection,
  CollectionType,
  Card,
} from 'react-helsinki-headless-cms';
import { ArticleQuery } from 'react-helsinki-headless-cms/cjs/__generated__-5977fcee';

import HtmlToReact from '../../common/components/htmlToReact/HtmlToReact';
import PageMeta from '../../common/components/meta/PageMeta';
import { SUPPORTED_LANGUAGES } from '../../constants';
import { getCmsPath } from '../../domain/app/routes/utils';
import { Post } from '../../generated/graphql-cms';
import { Language } from '../../types';
import { stripLocaleFromUri } from '../utils';

export const SEARCH_PANEL_TRESHOLD = 5;

const CmsArticle: React.FC<{
  article: ArticleQuery['post'];
  breadcrumbs: Breadcrumb[];
  collections?: CollectionType[];
}> = ({ article, breadcrumbs, collections }) => {
  const { t } = useTranslation();

  if (!article) return null;

  const { title, ...seo } = article.seo ?? {};
  const localePaths = formLocalePathsFromPage(article);

  const extendedBreadCrumbs = [
    {
      title: t('cms:linkFrontPage'),
      link: '/',
    },
    ...breadcrumbs,
  ];

  return (
    <>
      <PageMeta title={title ?? 'Title'} {...seo} localePaths={localePaths} />
      <RHHCPageContent
        page={article as PageContentProps['page']}
        breadcrumbs={extendedBreadCrumbs}
        collections={collections?.map((collection) => (
          <Collection
            key={`collection-${Math.random()}`}
            title={collection.title}
            collectionContainerProps={{
              withDots: collection.items.length < 4 ? false : true,
            }}
            type="grid"
            cards={collection.items.map((item) => (
              <Card
                key={item.id}
                {...item}
                customContent={<HtmlToReact>{item.lead}</HtmlToReact>}
                withShadow={true}
                hasLink={true}
                url={item.uri}
                imageLabel={item.featuredImage?.node?.imageLabel}
                imageUrl={item.featuredImage?.node?.mediaItemUrl}
              />
            ))}
          />
        ))}
      />
    </>
  );
};

const formLocalePathsFromPage = (article: ArticleQuery['post']) => {
  if (article) {
    const localePaths = [
      getPathAndLocale(article as Post),
      ...(article.translations?.map((translation) =>
        getPathAndLocale(translation as Post)
      ) ?? []),
    ];
    return localePaths;
  }

  function getPathAndLocale(pageNode: Post) {
    const locale = pageNode.language?.code?.toLowerCase() as Language;
    const uriWithoutLocale = stripLocaleFromUri(pageNode.uri ?? '');
    let cmsUri = getCmsPath(uriWithoutLocale);

    // locale needed in the beginning of the path
    if (locale !== SUPPORTED_LANGUAGES.FI) {
      cmsUri = `/${locale}${cmsUri}`;
    }

    return {
      locale,
      path: cmsUri,
    };
  }
};

export default CmsArticle;
