import { gql } from 'graphql-tag';

export const QUERY_PERSON = gql`
  fragment studyGroupFields on StudyGroupNode {
    id
    unitId
    unitName
    unit {
      ... on ExternalPlace {
        name {
          ...localisedFields
        }
      }
      ... on Place {
        internalId
        id
        name {
          ...localisedFields
        }
      }
    }
    groupSize
    amountOfAdult
    groupName
    studyLevels {
      edges {
        node {
          ...studyLevelFields
        }
      }
    }
    extraNeeds
    person {
      ...personFields
    }
  }
`;
