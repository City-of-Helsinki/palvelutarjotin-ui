import { useRouter } from 'next/router';
import React from 'react';

import { usePageQuery } from '../../generated/graphql-cms';
import apolloClient from '../client';

const CmsPageContent = (): JSX.Element => {
  const {
    query: { pageId },
  } = useRouter();

  const { data: page, loading } = usePageQuery({
    client: apolloClient,
    variables: {
      id: pageId as string,
    },
  });

  return (
    <div>
      {!loading && !!page?.page && (
        <div>
          <p>CmsPAgeContent {pageId}</p>
          <div
            dangerouslySetInnerHTML={{
              __html: page?.page?.content ?? '',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CmsPageContent;
