import { useRouter } from 'next/router';
import React from 'react';

import HtmlToReact from '../../common/components/htmlToReact/HtmlToReact';
import PageMeta from '../../common/components/meta/PageMeta';
import Container from '../../domain/app/layout/Container';
import { PageIdType, usePageQuery } from '../../generated/graphql-cms';
import useLocale from '../../hooks/useLocale';
import { Language } from '../../types';
import { useCMSClient } from '../cmsApolloContext';

export const getUriID = (slug: string, locale: Language): string => {
  if (locale === 'fi') {
    return `/${slug}/`;
  }
  return `/${locale}/${slug}/`;
};

const CmsPageContent: React.FC = () => {
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
    },
  });

  const title = pageData?.page?.title || '';
  const content = pageData?.page?.content || '';

  return (
    <Container>
      <PageMeta title={title} />
      {pageData?.page && (
        <>
          <h1>{title}</h1>
          <HtmlToReact>{content}</HtmlToReact>
        </>
      )}
    </Container>
  );
};

export default CmsPageContent;
