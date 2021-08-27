import { useRouter } from 'next/router';
import React from 'react';

import HtmlToReact from '../../common/components/htmlToReact/HtmlToReact';
import PageMeta from '../../common/components/meta/PageMeta';
import Container from '../../domain/app/layout/Container';
import { Page, PageIdType, usePageQuery } from '../../generated/graphql-cms';
import useLocale from '../../hooks/useLocale';
import { Language } from '../../types';
import { useCMSClient } from '../cmsApolloContext';

export const getUriID = (slug: string, locale: Language): string => {
  if (locale === 'fi') {
    return `/${slug}/`;
  }
  return `/${locale}/${slug}/`;
};

const CmsPageContent: React.FC<{ page: Page }> = ({ page }) => {
  const title = page?.title || '';
  const content = page?.content || '';

  return (
    <Container>
      <PageMeta title={title} />
      {page && (
        <>
          <h1>{title}</h1>
          <HtmlToReact>{content}</HtmlToReact>
        </>
      )}
    </Container>
  );
};

export default CmsPageContent;
