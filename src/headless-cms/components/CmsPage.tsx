import React from 'react';

import PageMeta from '../../common/components/meta/PageMeta';
import { SUPPORTED_LANGUAGES } from '../../constants';
import { getCmsPath } from '../../domain/app/routes/utils';
import { Page, PageQuery } from '../../generated/graphql-cms';
import { Language } from '../../types';
import { stripLocaleFromUri } from '../utils';
import Breadcrumbs, { Breadcrumb } from './Breadcrumbs';
import styles from './cmsPage.module.scss';
import CmsPageContent from './CmsPageContent';
import CmsPageSearch from './CmsPageSearch/CmsPageSearch';

export const SEARCH_PANEL_TRESHOLD = 5;

const CmsPage: React.FC<{
  page: PageQuery['page'];
  breadcrumbs: Breadcrumb[];
}> = ({ page, breadcrumbs }) => {
  if (!page) return null;

  const { title, ...seo } = page.seo ?? {};
  const localePaths = formLocalePathsFromPage(page);
  const showSearch =
    (page?.children?.nodes?.length ?? 0) > SEARCH_PANEL_TRESHOLD;

  return (
    <div className={styles.cmsPageContainer}>
      <PageMeta title={title ?? 'Title'} {...seo} localePaths={localePaths} />
      {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
      <CmsPageContent page={page} />
      {showSearch && <CmsPageSearch page={page as Page} />}
    </div>
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
