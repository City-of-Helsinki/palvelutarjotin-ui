import React from 'react';

import HtmlToReact from '../../common/components/htmlToReact/HtmlToReact';
import PageMeta from '../../common/components/meta/PageMeta';
import Container from '../../domain/app/layout/Container';
import { Page } from '../../generated/graphql-cms';

const CmsPageContent: React.FC<{ page: Page }> = ({ page }) => {
  const title = page?.translation?.title || '';
  const content = page?.translation?.content || '';

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
