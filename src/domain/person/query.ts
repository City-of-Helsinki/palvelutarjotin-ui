import gql from 'graphql-tag';

export const QUERY_PERSON = gql`
  fragment personFields on PersonNode {
    id
    emailAddress
    name
    phoneNumber
    language
  }
`;
