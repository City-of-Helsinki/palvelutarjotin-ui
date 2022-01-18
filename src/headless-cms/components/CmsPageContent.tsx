import React from 'react';

import { PageFieldsFragment } from '../../generated/graphql-cms';
import CmsOneColumnLayout from './CmsOneColumnLayout';
import CmsSidebarLayout from './CmsSidebarLayout';

const CmsPageContent: React.FC<{ page: PageFieldsFragment | undefined }> = ({
  page,
}) => {
  const sidebarContents = page?.sidebar || [];

  if (sidebarContents.length > 0) {
    return <CmsSidebarLayout page={page} />;
  }

  return <CmsOneColumnLayout page={page} />;
};

export default CmsPageContent;
