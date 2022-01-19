import React from 'react';

import { PageFieldsFragment } from '../../generated/graphql-cms';
import CmsSidebarLayout from './CmsSidebarLayout';

const CmsPageContent: React.FC<{ page: PageFieldsFragment | undefined }> = ({
  page,
}) => {
  return <CmsSidebarLayout page={page} />;
};

export default CmsPageContent;
