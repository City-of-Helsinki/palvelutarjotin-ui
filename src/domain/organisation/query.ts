import gql from 'graphql-tag';

export const QUERY_EVENT = gql`
  fragment organisationFields on OrganisationNode {
    id
    name
  }
`;
