import { MockedResponse } from '@apollo/client/testing';

import * as graphql from '../../generated/graphql';

export const emptyKeywordSetRequestMocks: MockedResponse[] = [
  {
    request: {
      query: graphql.KeywordSetDocument,
      variables: {
        setType: 'TARGET_GROUP',
      },
    },
    result: {
      data: { keywordSet: null },
    },
  },
  {
    request: {
      query: graphql.KeywordSetDocument,
      variables: {
        setType: 'CATEGORY',
      },
    },
    result: {
      data: { keywordSet: null },
    },
  },
  {
    request: {
      query: graphql.KeywordSetDocument,
      variables: {
        setType: 'ADDITIONAL_CRITERIA',
      },
    },
    result: {
      data: { keywordSet: null },
    },
  },
];
