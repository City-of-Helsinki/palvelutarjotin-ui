import { SearchInput } from 'hds-react';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import React from 'react';

import { ROUTES } from '../../domain/app/routes/constants';
import {
  Page,
  PageIdType,
  useSubPagesSearchQuery,
} from '../../generated/graphql-cms';
import { useCMSClient } from '../cmsApolloContext';

const CmsPageSearch: React.FC<{
  page: Page | undefined | null;
}> = ({ page }): JSX.Element => {
  const [searchResult, setSearchResult] = React.useState<Page[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const cmsClient = useCMSClient();

  const { data: pageData, loading } = useSubPagesSearchQuery({
    client: cmsClient,
    skip: !page?.uri,
    variables: {
      id: page?.uri ?? '',
      idType: PageIdType.Uri,
      search: searchTerm ?? '',
    },
  });

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

const CmsPageSearchForm: React.FC<{
  page: Page | undefined | null;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}> = ({ page, setSearchTerm }): JSX.Element => {
  const searchForm = (helperText: string) => (
    <div>
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
    return searchForm(
      "Search from {page.translation?.title} page's subpages..."
    );
  }

  return searchForm('Search from all the pages...');
};

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
        return (
          <div key={`page-${page.id}`}>
            <Link href={pageUri}>{page.title}</Link>
          </div>
        );
      })}
    </div>
  );
};

export default CmsPageSearch;
