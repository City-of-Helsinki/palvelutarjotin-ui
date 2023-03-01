import { useTranslation } from 'next-i18next';
import React from 'react';
import {
  PageContent as RHHCPageContent,
  PageContentProps,
  Breadcrumb,
  GeneralCollectionType,
} from 'react-helsinki-headless-cms';

import CmsPageSearch from './CmsPageSearch/CmsPageSearch';
import { getCmsCollectionList } from './utils';
import { Page, PageQuery } from '../../generated/graphql-cms';

export const SEARCH_PANEL_TRESHOLD = 2;

const CmsPage: React.FC<{
  page: PageQuery['page'];
  breadcrumbs: Breadcrumb[];
  collections?: GeneralCollectionType[];
  hideHero?: boolean;
}> = ({ page, breadcrumbs, collections = [], hideHero = true }) => {
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
      // FIXME: Start supporting the hero when the content from CMS does not duplicate it
      heroContainer={hideHero ? <div style={{ display: 'none' }} /> : <></>}
      page={page as PageContentProps['page']}
      breadcrumbs={extendedBreadCrumbs}
      collections={() =>
        collections?.length ? getCmsCollectionList(collections) : []
      }
    />
  );
};

export default CmsPage;
