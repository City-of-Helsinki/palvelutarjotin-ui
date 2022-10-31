import { useTranslation } from 'next-i18next';
import React from 'react';
import {
  PageContent as RHHCPageContent,
  PageContentProps,
  Breadcrumb,
  GeneralCollectionType,
} from 'react-helsinki-headless-cms';

import PageMeta from '../../common/components/meta/PageMeta';
import { SUPPORTED_LANGUAGES } from '../../constants';
import { getCmsArticlePath } from '../../domain/app/routes/utils';
import { ArticleQuery, Post } from '../../generated/graphql-cms';
import { Language } from '../../types';
import { stripLocaleFromUri } from '../utils';
import { getCmsCollectionList } from './utils';

const CmsArticle: React.FC<{
  article: ArticleQuery['post'];
  breadcrumbs: Breadcrumb[];
  collections?: GeneralCollectionType[];
}> = ({ article, breadcrumbs, collections = [] }) => {
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
        collections={getCmsCollectionList(collections)}
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
    let cmsUri = getCmsArticlePath(uriWithoutLocale);

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
