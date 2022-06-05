import { NetworkStatus } from '@apollo/client';
import React from 'react';
import {
  Card,
  CardProps,
  CollectionItemType,
  LargeCard,
  LargeCardProps,
  SearchPageContent,
  useConfig,
  PageMeta,
  PageMainContent,
} from 'react-helsinki-headless-cms';

import HtmlToReact from '../../../common/components/htmlToReact/HtmlToReact';
import Container from '../../../domain/app/layout/Container';
import { getEventPlaceholderImage } from '../../../domain/event/utils';
import {
  Page,
  PageIdType,
  useSubPagesSearchQuery,
} from '../../../generated/graphql-cms';
import useDebounce from '../../../hooks/useDebounce';
import { useCMSClient } from '../../cmsApolloContext';

const BLOCK_SIZE = 10;
const SEARCH_DEBOUNCE_TIME = 500;

const CmsPageSearch: React.FC<{
  page: Page;
}> = ({ page }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_TIME);
  const cmsClient = useCMSClient();
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
      } catch (e) {}
    }
  };

  const subPages =
    pageData?.page?.children?.edges
      ?.map((edge) => edge?.node as Page)
      .filter((page) => !!page) ?? [];

  const getCardProps = (
    item: CollectionItemType
  ): CardProps | LargeCardProps => ({
    id: item?.id,
    ariaLabel: item?.title || '',
    title: item?.title || '',
    subTitle: '',
    customContent: <HtmlToReact>{item?.lead || ''}</HtmlToReact>,
    url: item?.slug || '',
    imageUrl:
      item?.featuredImage?.node?.mediaItemUrl || getEventPlaceholderImage(''),
  });

  const customContent = (
    <PageMainContent title={page.title ?? ''} content={page.content ?? ''} />
  );

  return (
    <>
      {Head && <PageMeta headComponent={Head} page={page} />}
      <Container>
        <SearchPageContent
          customContent={customContent}
          items={subPages}
          onSearch={(freeSearch, tags) => {
            setSearchTerm(freeSearch);
          }}
          onLoadMore={() => {
            fetchMorePages();
          }}
          largeFirstItem={false}
          createLargeCard={(item) => <LargeCard {...getCardProps(item)} />}
          createCard={(item) => <Card {...getCardProps(item)} />}
          hasMore={hasMoreToLoad}
          isLoading={isLoading || isLoadingMore}
        />
      </Container>
    </>
  );
};

export default CmsPageSearch;
