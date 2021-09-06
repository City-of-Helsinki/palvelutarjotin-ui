import { Button, Card, SearchInput } from 'hds-react';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import React from 'react';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
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

const BLOCK_SIZE = 10;

const CmsPageSearch: React.FC<{
  page?: Page | undefined | null;
}> = ({ page }) => {
  if (page) {
    return <CmsPageSearchFromSubPages page={page} />;
  }
  return <CmsPageSearchFromAllPages />;
};

/**
 * Search a page from all the pages.
 */
const CmsPageSearchFromAllPages: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const cmsClient = useCMSClient();

  // Search from all the pages
  const {
    data: pageData,
    loading,
    fetchMore,
  } = usePagesSearchQuery({
    client: cmsClient,
    variables: {
      search: searchTerm ?? '',
      first: BLOCK_SIZE,
      after: '',
    },
  });

  const pageInfo = pageData?.pages?.pageInfo;
  const hasMoreToLoad = pageInfo?.hasNextPage ?? false;

  const fetchMorePages = async () => {
    if (hasMoreToLoad) {
      try {
        setIsLoadingMore(true);
        await fetchMore({
          variables: {
            first: BLOCK_SIZE,
            after: pageInfo?.endCursor,
          },
          // TODO: updateQuery seems to be deprecated
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return Object.assign({}, prev, {
              ...fetchMoreResult,
              pages: {
                ...fetchMoreResult.pages,
                edges: [
                  ...(prev?.pages?.edges ?? []),
                  ...(fetchMoreResult?.pages?.edges ?? []),
                ].flat(),
              },
            });
          },
        });
        setIsLoadingMore(false);
      } catch (e) {
        setIsLoadingMore(false);
      }
    }
  };

  const pages =
    pageData?.pages?.edges
      ?.map((edge) => edge?.node as Page)
      .filter((page) => !!page) ?? [];

  return (
    <div>
      <CmsPageSearchForm setSearchTerm={setSearchTerm} />
      <CmsPageSearchList
        pages={pages}
        loading={loading}
        isLoadingMore={isLoadingMore}
        fetchMore={fetchMorePages}
        hasMoreToLoad={hasMoreToLoad}
      />
    </div>
  );
};

/**
 * Search a page from page's sub pages.
 */
const CmsPageSearchFromSubPages: React.FC<{
  page: Page | undefined | null;
}> = ({ page }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const cmsClient = useCMSClient();

  // Search sub pages
  const {
    data: pageData,
    loading,
    fetchMore,
  } = useSubPagesSearchQuery({
    client: cmsClient,
    skip: !page?.uri,
    variables: {
      first: BLOCK_SIZE,
      after: '',
      id: page?.uri ?? '',
      idType: PageIdType.Uri,
      search: searchTerm ?? '',
    },
  });

  const pageInfo = pageData?.page?.children?.pageInfo;
  const hasMoreToLoad = pageInfo?.hasNextPage ?? false;

  const fetchMorePages = async () => {
    if (hasMoreToLoad) {
      try {
        setIsLoadingMore(true);
        await fetchMore({
          variables: {
            first: BLOCK_SIZE,
            after: pageInfo?.endCursor,
          },
          // TODO: updateQuery seems to be deprecated
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return Object.assign({}, prev, {
              ...fetchMoreResult,
              page: {
                ...fetchMoreResult.page,
                children: {
                  ...fetchMoreResult?.page?.children,
                  edges: [
                    ...(prev?.page?.children?.edges ?? []),
                    ...(fetchMoreResult?.page?.children?.edges ?? []),
                  ].flat(),
                },
              },
            });
          },
        });
        setIsLoadingMore(false);
      } catch (e) {
        setIsLoadingMore(false);
      }
    }
  };

  const subPages =
    pageData?.page?.children?.edges
      ?.map((edge) => edge?.node as Page)
      .filter((page) => !!page) ?? [];

  return (
    <div>
      <CmsPageSearchForm page={page} setSearchTerm={setSearchTerm} />
      <CmsPageSearchList
        pages={subPages}
        loading={loading}
        isLoadingMore={isLoadingMore}
        fetchMore={fetchMorePages}
        hasMoreToLoad={hasMoreToLoad}
      />
    </div>
  );
};

/**
 * Search form to search headless cms pages from all the pages or 1 page's sub pages.
 */
const CmsPageSearchForm: React.FC<{
  page?: Page | undefined | null;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}> = ({ page, setSearchTerm }) => {
  const helperText = page
    ? `Search from ${page.title} page's subpages...`
    : 'Search from all the pages...';

  return (
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
};

/**
 * List the search results as cards.
 */
const CmsPageSearchList: React.FC<{
  pages: Page[];
  loading: boolean;
  isLoadingMore: boolean;
  hasMoreToLoad: boolean;
  fetchMore: () => void;
}> = ({ pages, loading, isLoadingMore, fetchMore, hasMoreToLoad }) => {
  // const router = useRouter();
  // const goToPage =
  //   (pathname: string) =>
  //   (event?: React.MouseEvent<HTMLAnchorElement> | Event) => {
  //     event?.preventDefault();
  //     router.push(pathname);
  //   };

  return (
    <div>
      <LoadingSpinner isLoading={loading}>
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
      </LoadingSpinner>
      {hasMoreToLoad && <Button onClick={fetchMore}>Lataa lisää</Button>}
      <LoadingSpinner isLoading={isLoadingMore ?? false} />
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
