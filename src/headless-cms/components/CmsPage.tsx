import { useRouter } from 'next/router';
import React from 'react';

import {
  Page,
  PageFieldsFragment,
  PageIdType,
  usePageQuery,
} from '../../generated/graphql-cms';
import useLocale from '../../hooks/useLocale';
import { Language } from '../../types';
import { useCMSClient } from '../cmsApolloContext';
import CmsPageContent from './CmsPageContent';
import CmsPageNavigation from './CmsPageNavigation';
import CmsPageSearch from './CmsPageSearch/CmsPageSearch';

export const getUriID = (slugs: string[], locale: Language): string => {
  if (!slugs) return '/';
  if (locale === 'fi') {
    return `/${slugs.join('/')}/`;
  }
  return `/${locale}/${slugs.join('/')}/`;
};

const CmsPage: React.FC = () => {
  const {
    query: { slug },
  } = useRouter();

  const locale = useLocale();
  const cmsClient = useCMSClient();

  const { data: pageData } = usePageQuery({
    client: cmsClient,
    variables: {
      id: getUriID(slug as string[], locale),
      idType: PageIdType.Uri,
    },
  });

  const showNavigation =
    pageData?.page?.parent?.node || !!pageData?.page?.children?.nodes?.length;

  const showSearch = (pageData?.page?.children?.nodes?.length ?? 0) > 1;

  return (
    <div>
      {showNavigation && <CmsPageNavigation page={pageData?.page as Page} />}
      <CmsPageContent page={pageData?.page as PageFieldsFragment} />
      {showSearch && <CmsPageSearch page={pageData?.page as Page} />}
    </div>
  );
};

export default CmsPage;
