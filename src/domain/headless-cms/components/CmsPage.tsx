import {
  PageContent as RHHCPageContent,
  PageContentProps,
  GeneralCollectionType,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import { BreadcrumbListItem } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import CmsPageSearch from './CmsPageSearch/CmsPageSearch';
import { getCmsCollectionList } from './utils';
import { Page } from '../../../generated/graphql-cms';
import type { I18nNamespace } from '../../../types';

export const SEARCH_PANEL_TRESHOLD = 2;

const CmsPage: React.FC<{
  page: Page;
  breadcrumbs: BreadcrumbListItem[];
  collections?: GeneralCollectionType[];
  hideHero?: boolean;
}> = ({ page, breadcrumbs, collections = [], hideHero = true }) => {
  const { t } = useTranslation<I18nNamespace>();

  if (!page) return null;

  const showSearch =
    (page?.children?.nodes?.length ?? 0) > SEARCH_PANEL_TRESHOLD;

  const extendedBreadCrumbs = [
    {
      title: t('cms:linkFrontPage'),
      path: '/',
    },
    ...breadcrumbs,
  ];

  if (showSearch) {
    // TODO: Implement this with from ArchivePage from RHHC to get better layout
    return <CmsPageSearch page={page} />;
  }

  return (
    <RHHCPageContent
      // NOTE: hideHero defaults true because CMS page body content often
      // duplicates the hero block. Suppress RHHC hero until content model
      // exposes a single hero without duplication.
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
