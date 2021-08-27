import Link from 'next/link';
import React from 'react';

import { ROUTES } from '../../domain/app/routes/constants';
import { Page } from '../../generated/graphql-cms';

const CmsPageNavigation: React.FC<{
  page: Page | undefined | null;
}> = ({ page }): JSX.Element => {
  const parentPage = page?.parent?.node as Page;
  const childrenPages = (page?.children?.nodes as Page[]) ?? [];

  return (
    <div>
      <p>CmsPageNavigation {page?.id}</p>
      Parent:
      <ul>
        {parentPage && (
          <li>
            <Link
              href={`${ROUTES.CMS_PAGE.replace(
                '/:id',
                parentPage?.uri as string
              )}`}
            >
              {parentPage?.title}
            </Link>
          </li>
        )}
      </ul>
      Children:
      <ul>
        {childrenPages
          .filter((subPage) => subPage != null)
          .map((subPage) => (
            <li key={`subPage-${subPage?.id}`}>
              <Link
                href={`${ROUTES.CMS_PAGE.replace(
                  '/:id',
                  subPage?.uri as string
                )}`}
              >
                {subPage?.title}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CmsPageNavigation;
