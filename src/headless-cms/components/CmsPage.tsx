import { useTranslation } from 'next-i18next';
import React from 'react';
import {
  PageContent as RHHCPageContent,
  Breadcrumb,
} from 'react-helsinki-headless-cms';

import PageMeta from '../../common/components/meta/PageMeta';
import { SUPPORTED_LANGUAGES } from '../../constants';
import { getCmsPath } from '../../domain/app/routes/utils';
import { Page, PageQuery } from '../../generated/graphql-cms';
import { Language } from '../../types';
import { stripLocaleFromUri } from '../utils';
import CmsPageSearch from './CmsPageSearch/CmsPageSearch';

export const SEARCH_PANEL_TRESHOLD = 5;

const CmsPage: React.FC<{
  page: PageQuery['page'];
  breadcrumbs: Breadcrumb[];
}> = ({ page, breadcrumbs }) => {
  const { t } = useTranslation();

  if (!page) return null;

  const { title, ...seo } = page.seo ?? {};
  const localePaths = formLocalePathsFromPage(page);
  const showSearch =
    (page?.children?.nodes?.length ?? 0) > SEARCH_PANEL_TRESHOLD;

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
      <RHHCPageContent page={page} breadcrumbs={extendedBreadCrumbs} />
      {showSearch && <CmsPageSearch page={page as Page} />}
    </>
  );
};

const formLocalePathsFromPage = (page: PageQuery['page']) => {
  if (page) {
    const localePaths = [
      getPathAndLocale(page as Page),
      ...(page.translations?.map((translation) =>
        getPathAndLocale(translation as Page)
      ) ?? []),
    ];
    return localePaths;
  }

  function getPathAndLocale(pageNode: Page) {
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

export default CmsPage;
