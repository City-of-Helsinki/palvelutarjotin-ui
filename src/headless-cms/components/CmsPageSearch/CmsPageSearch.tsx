import { NetworkStatus } from '@apollo/client';
import { Button, Card, TextInput } from 'hds-react';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import Container from '../../../domain/app/layout/Container';
import { getCmsPath } from '../../../domain/app/routes/utils';
import { getEventPlaceholderImage } from '../../../domain/event/utils';
import {
  Page,
  PageIdType,
  useSubPagesSearchQuery,
} from '../../../generated/graphql-cms';
import useDebounce from '../../../hooks/useDebounce';
import { useCMSClient } from '../../cmsApolloContext';
import styles from './cmspagesearch.module.scss';

const BLOCK_SIZE = 3;
const SEARCH_DEBOUNCE_TIME = 500;

const CmsPageSearch: React.FC<{
  page: Page;
}> = ({ page }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_TIME);
  const cmsClient = useCMSClient();

  const {
    data: pageData,
    fetchMore,
    loading,
    networkStatus,
  } = useSubPagesSearchQuery({
    client: cmsClient,
    skip: !page?.uri,
    notifyOnNetworkStatusChange: true,
    variables: {
      first: BLOCK_SIZE,
      id: page?.uri ?? '',
      idType: PageIdType.Uri,
      search: debouncedSearchTerm ?? '',
    },
  });

  const isLoading = loading && networkStatus !== NetworkStatus.fetchMore;
  const isLoadingMore = networkStatus === NetworkStatus.fetchMore;
  const pageInfo = pageData?.page?.children?.pageInfo;
  const hasMoreToLoad = pageInfo?.hasNextPage ?? false;

  const fetchMorePages = async () => {
    if (hasMoreToLoad) {
      try {
        await fetchMore({
          variables: {
            first: BLOCK_SIZE,
            after: pageInfo?.endCursor,
          },
        });
      } catch (e) {}
    }
  };

  const subPages =
    pageData?.page?.children?.edges
      ?.map((edge) => edge?.node as Page)
      .filter((page) => !!page) ?? [];

  return (
    <Container>
      <CmsPageSearchForm
        page={page}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
      />
      <CmsPageSearchList
        pages={subPages}
        loading={isLoading}
        isLoadingMore={isLoadingMore}
        fetchMore={fetchMorePages}
        hasMoreToLoad={hasMoreToLoad}
      />
    </Container>
  );
};

/**
 * Search form to search headless cms pages from all the pages or 1 page's sub pages.
 */
const CmsPageSearchForm: React.FC<{
  page: Page;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}> = ({ page, searchTerm, setSearchTerm }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.searchForm}>
      <TextInput
        id="page-search"
        label={t('cms:pageSearch.searchLabel')}
        value={searchTerm}
        helperText={t('cms:pageSearch.searchHelperText', { title: page.title })}
        onChange={(e) => setSearchTerm(e.target.value)}
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
  const { t } = useTranslation();
  return (
    <div>
      <LoadingSpinner isLoading={loading}>
        {pages.map((page, index) => {
          const pageUri = getCmsPath(page?.uri);
          const pageLead =
            page.lead?.replaceAll('<p>', '')?.replaceAll('</p>', '') ?? '';
          const imgSrc =
            page.featuredImage?.node?.mediaItemUrl ??
            getEventPlaceholderImage(page.id);

          return (
            <Link href={pageUri}>
              <Card
                key={`page-${page.id}`}
                heading={page.title ?? ''}
                text={pageLead}
                border={false}
                className={styles.card}
              >
                <img
                  src={imgSrc}
                  alt={page.featuredImage?.node?.altText ?? ''}
                  className={styles.cardImage}
                />
              </Card>
            </Link>
          );
        })}
      </LoadingSpinner>
      {isLoadingMore ? (
        <LoadingSpinner isLoading hasPadding={false} />
      ) : hasMoreToLoad ? (
        <Button onClick={fetchMore}>{t('cms:pageSearch.loadMore')}</Button>
      ) : null}
    </div>
  );
};

export default CmsPageSearch;