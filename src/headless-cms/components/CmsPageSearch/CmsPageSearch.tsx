import { Card, SearchInput } from 'hds-react';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import React from 'react';

import { ROUTES } from '../../../domain/app/routes/constants';
import { getEventPlaceholderImage } from '../../../domain/event/utils';
import {
  Page,
  PageIdType,
  usePagesSearchQuery,
  useSubPagesSearchQuery,
} from '../../../generated/graphql-cms';
import { useCMSClient } from '../../cmsApolloContext';
import styles from './cmspagesearch.module.scss';

const CmsPageSearch: React.FC<{
  page?: Page | undefined | null;
}> = ({ page }): JSX.Element => {
  if (page) {
    return <CmsPageSearchFromSubPages page={page} />;
  }
  return <CmsPageSearchFromAllPages />;
};

/**
 * Search a page from all the pages.
 */
const CmsPageSearchFromAllPages: React.FC = (): JSX.Element => {
  const [searchResult, setSearchResult] = React.useState<Page[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const cmsClient = useCMSClient();

  // Search from all the pages
  const { data: pageData, loading } = usePagesSearchQuery({
    client: cmsClient,
    variables: {
      search: searchTerm ?? '',
    },
  });

  // Update the search results
  React.useEffect(() => {
    if (!loading && pageData?.pages) {
      const pages = pageData?.pages?.edges
        ?.map((edge) => edge?.node as Page)
        .filter((page) => !!page);
      setSearchResult(pages ?? []);
    }
  }, [searchTerm, pageData, loading]);

  return (
    <div>
      <CmsPageSearchForm setSearchTerm={setSearchTerm} />
      <CmsPageSearchList pages={searchResult} />
    </div>
  );
};

/**
 * Search a page from page's sub pages.
 */
const CmsPageSearchFromSubPages: React.FC<{
  page: Page | undefined | null;
}> = ({ page }): JSX.Element => {
  const [searchResult, setSearchResult] = React.useState<Page[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const cmsClient = useCMSClient();

  // Search sub pages
  const { data: pageData, loading } = useSubPagesSearchQuery({
    client: cmsClient,
    skip: !page?.uri,
    variables: {
      id: page?.uri ?? '',
      idType: PageIdType.Uri,
      search: searchTerm ?? '',
    },
  });

  // Update the search results
  React.useEffect(() => {
    if (!loading && pageData?.page) {
      const subPages = pageData?.page?.children?.edges
        ?.map((edge) => edge?.node as Page)
        .filter((page) => !!page);
      setSearchResult(subPages ?? []);
    }
  }, [searchTerm, pageData, loading]);

  return (
    <div>
      <CmsPageSearchForm page={page} setSearchTerm={setSearchTerm} />
      <CmsPageSearchList pages={searchResult} />
    </div>
  );
};

/**
 * Search form to search headless cms pages from all the pages or 1 page's sub pages.
 */
const CmsPageSearchForm: React.FC<{
  page?: Page | undefined | null;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}> = ({ page, setSearchTerm }): JSX.Element => {
  const searchForm = (helperText: string) => (
    <div className={styles.searchForm}>
      <SearchInput
        label="Search"
        helperText={helperText}
        searchButtonAriaLabel="Search"
        clearButtonAriaLabel="Clear search field"
        onSubmit={(submittedValue) => setSearchTerm(submittedValue)}
      />
    </div>
  );

  if (page) {
    return searchForm(`Search from ${page.title} page's subpages...`);
  }

  return searchForm('Search from all the pages...');
};

/**
 * List the search results as cards.
 */
const CmsPageSearchList: React.FC<{
  pages: Page[];
}> = ({ pages }): JSX.Element => {
  // const router = useRouter();
  // const goToPage =
  //   (pathname: string) =>
  //   (event?: React.MouseEvent<HTMLAnchorElement> | Event) => {
  //     event?.preventDefault();
  //     router.push(pathname);
  //   };

  return (
    <div>
      {pages.map((page, index) => {
        const pageUri = `${ROUTES.CMS_PAGE.replace('/:id', page?.uri ?? '')}`;
        const pageLead =
          page.lead?.replaceAll('<p>', '')?.replaceAll('</p>', '') ?? '';
        const pageImage = (
          <img
            src={
              page.featuredImage?.node?.mediaItemUrl ??
              getEventPlaceholderImage(page.id)
            }
            alt={page.featuredImage?.node?.altText ?? ''}
            className={styles.cardImage}
          />
        );
        return (
          <Link href={pageUri}>
            <Card
              key={`page-${page.id}`}
              heading={page.title ?? ''}
              text={pageLead}
              border={false}
              className={styles.card}
            >
              {pageImage}
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default CmsPageSearch;
export {
  CmsPageSearchFromAllPages,
  CmsPageSearchFromSubPages,
  CmsPageSearchForm,
  CmsPageSearchList,
};
