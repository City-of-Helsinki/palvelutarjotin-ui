import { useRouter } from 'next/router';

import { PageIdType, usePageQuery } from '../../../generated/graphql-cms';
import { useCMSApolloClient } from '../../headless-cms/apollo/apolloClient';

export const useCmsLanguageOptions = ({
  skip = false,
}: { skip?: boolean } = {}) => {
  const router = useRouter();
  const cmsClient = useCMSApolloClient();

  const { data: pageData } = usePageQuery({
    client: cmsClient,
    variables: {
      id: `${router.asPath.replace('/cms-page', '')}/`,
      idType: PageIdType.Uri,
    },
    skip,
  });

  return !skip
    ? [
        {
          uri: pageData?.page?.uri,
          locale: pageData?.page?.language?.code?.toLowerCase(),
        },
        ...(pageData?.page?.translations?.map((translation) => ({
          uri: translation?.uri,
          locale: translation?.language?.code?.toLowerCase(),
        })) ?? []),
      ]
    : [];
};
