import { useRouter } from 'next/router';
import React from 'react';

import {
  LanguageCodeEnum,
  Page,
  PageIdType,
  usePageQuery,
} from '../../generated/graphql-cms';
import useLocale from '../../hooks/useLocale';
import { Language } from '../../types';
import { useCMSClient } from '../cmsApolloContext';
import CmsPageContent from './CmsPageContent';
import CmsPageNavigation from './CmsPageNavigation';

export const getUriID = (slug: string, locale: Language): string => {
  if (locale === 'fi') {
    return `/${slug}/`;
  }
  return `/${locale}/${slug}/`;
};

const CmsPage: React.FC = () => {
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
      language: locale.toString().toUpperCase() as LanguageCodeEnum,
    },
  });

  return (
    <div>
      <CmsPageNavigation page={pageData?.page as Page} />
      <CmsPageContent page={pageData?.page as Page} />
    </div>
  );
};

export default CmsPage;
