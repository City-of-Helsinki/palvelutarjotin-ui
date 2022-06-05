import { useTranslation } from 'next-i18next';
import React from 'react';
import {
  PageContent as RHHCPageContent,
  PageContentProps,
  Breadcrumb,
  CollectionType,
} from 'react-helsinki-headless-cms';

import { Page, PageQuery } from '../../generated/graphql-cms';
import CmsPageSearch from './CmsPageSearch/CmsPageSearch';
import { getCmsCollectionList } from './utils';

export const SEARCH_PANEL_TRESHOLD = 2;

const CmsPage: React.FC<{
  page: PageQuery['page'];
  breadcrumbs: Breadcrumb[];
  collections?: CollectionType[];
}> = ({ page, breadcrumbs, collections = [] }) => {
  const { t } = useTranslation();

  if (!page) return null;

  const showSearch =
    (page?.children?.nodes?.length ?? 0) > SEARCH_PANEL_TRESHOLD;

  const extendedBreadCrumbs = [
    {
      title: t('cms:linkFrontPage'),
      link: '/',
    },
    ...breadcrumbs,
  ];

  if (showSearch) {
    // TODO: Implement this with from ArchivePage from RHHC to get better layout
    return <CmsPageSearch page={page as Page} />;
  }

  return (
    <RHHCPageContent
      page={page as PageContentProps['page']}
      breadcrumbs={extendedBreadCrumbs}
      collections={getCmsCollectionList(collections)}
    />
  );
};

export default CmsPage;
