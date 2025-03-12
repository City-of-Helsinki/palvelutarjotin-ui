import { NetworkStatus } from '@apollo/client';
import React from 'react';
import {
  Card,
  CardProps,
  LargeCard,
  LargeCardProps,
  SearchPageContent,
  useConfig,
  PageMeta,
  PageMainContent,
  PageType,
  HtmlToReact,
} from 'react-helsinki-headless-cms';

import styles from './cmsPageSearch.module.scss';
import {
  Page,
  PageIdType,
  useSubPagesSearchQuery,
} from '../../../../generated/graphql-cms';
import useDebounce from '../../../../hooks/useDebounce';
import Container from '../../../app/layout/Container';
import { getCmsPagePath } from '../../../app/routes/utils';
import { getEventPlaceholderImage } from '../../../event/utils';
import { useCMSApolloClient } from '../../apollo/apolloClient';

const BLOCK_SIZE = 9;
const SEARCH_DEBOUNCE_TIME = 500;

const CmsPageSearch: React.FC<{
  page: Page;
}> = ({ page }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_TIME);
  const cmsClient = useCMSApolloClient();
  const {
    components: { Head },
  } = useConfig();

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
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  };

  const subPages =
    pageData?.page?.children?.edges
      ?.map((edge) => edge?.node as Page)
      .filter((page) => !!page) ?? [];

  const getCardProps = (
    item?: PageType | null
  ): CardProps | LargeCardProps => ({
    id: item?.id,
    ariaLabel: item?.title || '',
    title: item?.title || '',
    subTitle: '',
    customContent: <HtmlToReact>{item?.lead || ''}</HtmlToReact>,
    url: getCmsPagePath(item?.uri ?? ''),
    imageUrl:
      item?.featuredImage?.node?.medium_large || getEventPlaceholderImage(''),
  });

  const customContent = (
    <PageMainContent title={page.title ?? ''} content={page.content ?? ''} />
  );

  return (
    <>
      {Head && <PageMeta headComponent={Head} page={page as PageType} />}
      <Container>
        <SearchPageContent
          className={styles.searchPageContent}
          customContent={customContent}
          items={subPages as PageType[]}
          onSearch={(freeSearch, tags) => {
            setSearchTerm(freeSearch);
          }}
          onLoadMore={() => {
            fetchMorePages();
          }}
          largeFirstItem={false}
          createLargeCard={(item) => (
            <LargeCard
              key={`large-card-${item?.id}`}
              {...getCardProps(item as PageType)}
            />
          )}
          createCard={(item) => (
            <Card
              key={`card-${item?.id}`}
              {...getCardProps(item as PageType)}
            />
          )}
          hasMore={hasMoreToLoad}
          isLoading={isLoading || isLoadingMore}
        />
      </Container>
    </>
  );
};

export default CmsPageSearch;
